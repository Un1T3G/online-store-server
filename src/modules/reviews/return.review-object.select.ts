import { Prisma } from '@prisma/client';

export const returnReviewObject: Prisma.ReviewSelect = {
  id: true,
  rating: true,
  text: true,
  createdAt: true,
};
