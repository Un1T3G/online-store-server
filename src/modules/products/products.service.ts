import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { paginator } from 'src/shared/utils/paginator.util';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductUpdateDto } from './dto/product.update.dto';
import { returnProductObject } from './return.product-object.select';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSimilar(productId: string, query?: PaginatorQuery) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return null;
    }

    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const products = pagination(this.prismaService.product, {
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObject,
    });

    return products;
  }

  async create(dto: ProductCreateDto) {
    const product = await this.prismaService.product.create({
      data: {
        ...dto,
        attributes: {
          create: dto.attributes,
        },
      },
    });

    return product.id;
  }

  async update(dto: ProductUpdateDto, productId: string) {
    const product = await this.prismaService.product.update({
      where: { id: productId },
      data: {
        ...dto,
        attributes: {
          deleteMany: {},
          create: dto.attributes,
        },
      },
    });

    return product ? product.id : null;
  }

  async delete(productId: string) {
    const product = await this.prismaService.product.delete({
      where: { id: productId },
    });

    return product ? product.id : null;
  }
}
