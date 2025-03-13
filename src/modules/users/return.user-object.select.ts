import { Prisma } from '@prisma/client';

export const returnUserObject: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  address: true,
  authByOAuth: true,
  role: true,
};
