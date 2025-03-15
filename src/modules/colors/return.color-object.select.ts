import { Prisma } from '@prisma/client';

export const returnColorObject: Prisma.ColorSelect = {
  id: true,
  name: true,
  value: true,
};
