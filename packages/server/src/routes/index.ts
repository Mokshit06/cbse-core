import { Router } from 'express';
import authRouter from './auth';
import meetingRouter from './meeting';
import classRouter from './class';
import notesRouter from './notes';
import schoolRouter from './school';

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});
router.use('/auth', authRouter);
router.use('/class', classRouter);
router.use('/meeting', meetingRouter);
router.use('/notes', notesRouter);
router.use('/school', schoolRouter);

export default router;
