import { Prisma } from '@prisma/client';
import { returnUserObject } from '../users/return.user-object.select';

export const returnReviewObject: Prisma.ReviewSelect = {
  id: true,
  rating: true,
  text: true,
  user: { select: returnUserObject },
  createdAt: true,
};
