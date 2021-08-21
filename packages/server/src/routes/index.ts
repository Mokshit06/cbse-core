import { Router } from 'express';
import authRouter from './auth';
import meetingRouter from './meeting';
import classRouter from './class';
import notesRouter from './notes';
import schoolRouter from './school';
import notificationsRouter from './notifications';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});
router.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  res.json({ data: user });
});
router.use('/auth', authRouter);
router.use('/class', classRouter);
router.use('/meeting', meetingRouter);
router.use('/notes', notesRouter);
router.use('/school', schoolRouter);
router.use('/notifications', notificationsRouter);

export default router;
