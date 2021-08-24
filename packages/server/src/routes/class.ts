import { Router } from 'express';
import { nanoid } from 'nanoid';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  if (!req.user) return;

  const userClass = await prisma.class.findUnique({
    where: { id: req.user.classId! },
    include: { participants: true },
  });

  res.json({ data: userClass });
});

router.post('/', async (req, res) => {
  if (!req.user) return;

  const user = (await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { school: true },
  }))!;
  // if (!user.school) {
  //   return res.status(400).json({
  //     message: "You haven't joined a school yet",
  //   });
  // }
  if (user.classId) {
    return res.status(400).json({
      message: "You've already joined a class",
    });
  }

  console.log(req.body);

  const userClass = await prisma.class.create({
    data: {
      school: {
        connect: {
          code: req.body.code,
        },
      },
      participants: {
        connect: { id: user.id },
      },
      code: nanoid(10),
      grade: parseInt(req.body.grade),
      section: req.body.section,
    },
  });

  res.status(201).json({
    message: 'Class created',
    data: { code: userClass.code },
  });
});

router.post('/join', async (req, res) => {
  if (!req.user) return;

  if (req.user.classId) {
    return res.status(400).json({
      message: 'You are already part of a class',
    });
  }

  const userClass = await prisma.class.findUnique({
    where: { code: req.body.code as string },
  });

  if (!userClass) {
    return res.status(404).json({
      message: "Class doesn't exist",
    });
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: { classId: userClass.id },
  });

  res.json({
    message: `Joining ${userClass.grade}${userClass.section}`,
  });
});

export default router;
