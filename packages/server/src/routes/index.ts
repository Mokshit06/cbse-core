import { Router } from 'express';
import authRouter from './auth';
import meetingRouter from './meeting';
import classRouter from './class';
import notesRouter from './notes';
import schoolRouter from './school';
import notificationsRouter from './notifications';
import chapterRouter from './chapters';
import prisma from '../lib/prisma';
import axios from 'axios';

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
router.use('/chapters', chapterRouter);
router.get('/pdf/:id.pdf', async (req, res) => {
  const { data } = await axios.get(
    `https://ncert.nic.in/textbook/pdf/${req.params.id}.pdf`,
    { responseType: 'stream' }
  );
  res.setHeader('content-type', 'application/pdf');
  data.pipe(res);
});

export default router;
