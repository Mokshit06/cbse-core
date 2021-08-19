import { Router } from 'express';
import authRouter from './auth';

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});
router.use('/auth', authRouter);

export default router;
