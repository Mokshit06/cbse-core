import { Router } from 'express';
import { nanoid } from 'nanoid';
import prisma from '../lib/prisma';

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
  });

  res.json(school);
});

router.post('/', async (req, res) => {
  if (!req.user) return;

  const school = await prisma.school.create({
    data: {
      name: req.body.name,
      address: req.body.address,
      code: nanoid(10),
      inchargeId: req.user.id,
    },
  });

  res.json({
    message: 'School registered!',
    data: { code: school.code },
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
