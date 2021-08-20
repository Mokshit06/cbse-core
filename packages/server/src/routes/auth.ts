import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/me', async (req, res) => {
  res.json(req.user);
});

router.post('/register', async (req, res) => {
  const data = req.body as User;
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return res.status(400).json({
      message: 'Account already exists',
    });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 8),
      role: data.role,
    },
  });

  (req.session as any).auth ||= {};
  (req.session as any).auth.user = user.id;
  req.user = user;

  res.status(201).json({
    message: 'Registration successful',
  });
});

router.post('/login', async (req, res) => {
  const data = req.body as User;
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    return res.status(400).json({
      message: "Account doesn't exist",
    });
  }

  const passwordIsCorrect = await bcrypt.compare(data.password, user.password);
  if (!passwordIsCorrect) {
    return res.status(400).json({
      message: 'Username or password is incorrect',
    });
  }

  (req.session as any).auth ||= {};
  (req.session as any).auth.user = user.id;
  req.user = user;

  res.json({
    message: 'Login successful',
  });
});

router.post('/logout', async (req, res) => {
  (req.session as any).auth = {};
  req.user = null as any;
  res.end();
});

export default router;
