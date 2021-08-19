import { Router } from 'express';
import authRouter from './auth';
import meetingRouter from './meeting';

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});
router.use('/auth', authRouter);
router.use('/meeting', meetingRouter);

export default router;
