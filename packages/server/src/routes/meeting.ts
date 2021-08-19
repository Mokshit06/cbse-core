import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { nanoid } from 'nanoid';
import prisma from '../lib/prisma';

const router = Router();

router.post('/create', async (req, res) => {
  if (!req.user) return;
  if (!req.user.classId || req.user.role !== UserRole.TEACHER) {
    return res.status(400).json({
      message: 'Unable to create meeting',
    });
  }

  const meeting = await prisma.meeting.create({
    data: {
      code: nanoid(10),
      classId: req.user.classId,
    },
  });

  res.status(201).json({ data: meeting });
});

router.get('/:code', async (req, res) => {
  if (!req.user) return;
  if (!req.user.classId) {
    return res.status(400).json({
      message: 'You are not part of a class yet',
    });
  }

  const meeting = await prisma.meeting.findUnique({
    where: { code: req.params.code },
  });

  if (!meeting) {
    return res.status(400).json({
      message: "Meeting doesn't exist",
    });
  }
  if (meeting.classId !== req.user.classId) {
    return res.status(400).json({
      message: 'You are not part of this class',
    });
  }

  res.json({ data: meeting });
});

export default router;
