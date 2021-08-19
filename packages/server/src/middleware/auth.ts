import { RequestHandler } from 'express';
import prisma from '../lib/prisma';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const auth = (req.session as any).auth;
  if (!auth) return next();

  const userId = auth.user;
  if (!userId) return next();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) return next();

  req.user = user;

  next();
};
