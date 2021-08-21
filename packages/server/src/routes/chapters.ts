import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  const chapters = await prisma.chapter.findMany({});

  res.json({ data: chapters });
});

export default router;
