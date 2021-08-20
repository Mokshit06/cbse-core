import { Prisma } from '@prisma/client';
import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  if (!req.user) return;
  if (!req.user.classId) {
    return res.status(400).send({
      message: 'You dont have a class yet',
    });
  }

  const notifications = await prisma.notification.findMany({
    where: {
      school: {
        classes: { some: { id: req.user.classId! } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  res.json({
    data: notifications,
  });
});

export default router;
