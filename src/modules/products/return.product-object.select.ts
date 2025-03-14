import { Prisma } from '@prisma/client';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  images: true,
  attributes: true,
  category: true,
  color: true,
  createdAt: true,
  updatedAt: true,
};
