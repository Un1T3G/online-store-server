import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'src/shared/types/paginator-with-search-term.query.type';
import { paginator } from 'src/shared/utils/paginator.util';
import { ColorCreateDto } from './dto/colors.create.dto';
import { ColorUpdateDto } from './dto/colors.update.dto';
import { returnColorObject } from './return.color-object.select';

@Injectable()
export class ColorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorWithSearchTermQuery) {
    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const colors = pagination(this.prismaService.color, {
      where: {
        name: {
          contains: query.searchTerm || '',
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnColorObject,
    });

    return colors;
  }

  async getById(id: string, select: Prisma.CategorySelect = returnColorObject) {
    const color = await this.prismaService.color.findUnique({
      where: {
        id,
      },
      select,
    });

    if (!color) {
      throw new BadRequestException('Color not found');
    }

    return color;
  }

  async create(dto: ColorCreateDto) {
    const color = await this.prismaService.color.create({
      data: dto,
    });

    return color.id;
  }

  async update(dto: ColorUpdateDto, categoryId: string) {
    const color = await this.prismaService.color.update({
      where: { id: categoryId },
      data: dto,
    });

    if (!color) {
      throw new BadRequestException('Color not found');
    }

    return color.id;
  }

  async delete(colorId: string) {
    const color = await this.prismaService.color.delete({
      where: { id: colorId },
    });

    if (!color) {
      throw new BadRequestException('Color not found');
    }

    return color.id;
  }
}
