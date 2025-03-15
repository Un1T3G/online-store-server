import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { paginator } from 'src/shared/utils/paginator.util';
import { ReviewCreateDto } from './dto/review.create.dto';
import { returnReviewObject } from './return.review-object.select';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorQuery) {
    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const reviews = pagination(this.prismaService.review, {
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });

    return reviews;
  }

  async create(dto: ReviewCreateDto, userId: string, productId: string) {
    const review = await this.prismaService.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return review.id;
  }

  async delete(reviewId: string) {
    const review = await this.prismaService.review.delete({
      where: { id: reviewId },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    return review.id;
  }
}
