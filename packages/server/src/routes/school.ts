import { Router } from 'express';
import { nanoid } from 'nanoid';
import prisma from '../lib/prisma';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  if (!req.user) return;

  const school = await prisma.school.findFirst({
    where: {
      OR: [
        { inchargeId: req.user.id },
        {
          classes: {
            some: {
              participants: {
                some: { id: req.user.id },
              },
            },
          },
        },
      ],
    },
    include: {
      classes: {
        include: { participants: true },
      },
    },
  });
  const teachers = school?.classes.flatMap(c =>
    c.participants.filter(p => p.role === UserRole.TEACHER)
  );
  const data = { ...school, teachers, participants: undefined };

  res.json({ data });
});

router.post('/', async (req, res) => {
  if (!req.user) return;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      school: {
        create: {
          name: req.body.name,
          address: req.body.address,
          code: nanoid(10),
        },
      },
    },
    include: { school: true },
  });

  res.json({
    message: 'School registered!',
    data: { code: user!.school!.code },
  });
});

router.post('/join', async (req, res) => {
  if (!req.user) return;

  await prisma.user.update({
    where: { id: req.user.id },
    data: { school: { connect: { code: req.body.code } } },
  });

  res.json({
    message: 'School joined!',
  });
});

export default router;
