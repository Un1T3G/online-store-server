import { Prisma } from '@prisma/client';

export const returnOrderObject: Prisma.OrderSelect = {
  id: true,
  total: true,
  status: true,
  items: true,
  createdAt: true,
};
