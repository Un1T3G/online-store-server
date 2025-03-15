import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'src/shared/types/paginator-with-search-term.query.type';
import { paginator } from 'src/shared/utils/paginator.util';
import { CategoryCreateDto } from './dto/categories.create.dto';
import { CategoryUpdateDto } from './dto/categories.update.dto';
import { returnCategoryObject } from './return.category-object.select';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorWithSearchTermQuery) {
    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const categories = pagination(this.prismaService.category, {
      where: {
        name: {
          contains: query.searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnCategoryObject,
    });

    return categories;
  }

  async getById(
    id: string,
    select: Prisma.CategorySelect = returnCategoryObject,
  ) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      select,
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  async create(dto: CategoryCreateDto) {
    const category = await this.prismaService.category.create({
      data: dto,
    });

    return category.id;
  }

  async update(dto: CategoryUpdateDto, categoryId: string) {
    const category = await this.prismaService.category.update({
      where: { id: categoryId },
      data: dto,
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category.id;
  }

  async delete(categoryId: string) {
    const category = await this.prismaService.category.delete({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category.id;
  }
}
