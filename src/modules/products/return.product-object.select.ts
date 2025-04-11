import { Prisma } from '@prisma/client';
import { returnReviewObject } from '../reviews/return.review-object.select';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  images: true,
  attributes: true,
  reviews: {
    select: returnReviewObject,
  },
  category: true,
  color: true,
  createdAt: true,
  updatedAt: true,
};
