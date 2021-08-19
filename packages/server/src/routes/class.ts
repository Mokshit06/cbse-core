import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  if (!req.user) return;

  const userClass = await prisma.class.findUnique({
    where: { id: req.user.classId! },
  });

  res.json({ data: userClass });
});

router.post('/', async (req, res) => {
  if (!req.user) return;

  const user = (await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { school: true },
  }))!;
  if (!user.school) {
    return res.status(400).json({
      message: "You haven't joined a school yet",
    });
  }
  if (user.classId) {
    return res.status(400).json({
      message: "You've already joined a class",
    });
  }

  await prisma.class.create({
    data: {
      schoolId: user.school.id,
      participants: {
        connect: { id: user.id },
      },
      grade: req.body.grade,
      section: req.body.section,
    },
  });

  res.status(201).json({
    message: 'Class created',
  });
});

export default router;
