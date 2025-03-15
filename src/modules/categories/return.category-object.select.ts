import { Prisma } from '@prisma/client';

export const returnCategoryObject: Prisma.CategorySelect = {
  id: true,
  title: true,
  description: true,
};
