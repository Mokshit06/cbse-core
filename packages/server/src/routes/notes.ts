import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.post('/', async (req, res) => {
  if (!req.user) return;

  const note = await prisma.note.create({
    data: {
      text: '',
      participantId: req.body.participantId,
    },
  });

  res.status(201).json({
    data: note,
  });
});

router.put('/:id', async (req, res) => {
  if (!req.user) return;

  const noteId = req.params.id as string;
  await prisma.note.update({
    where: { id: noteId },
    data: { text: req.body.text as string },
  });

  res.send();
});
