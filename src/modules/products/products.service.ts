import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'src/shared/types/paginator-with-search-term.query.type';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { paginator } from 'src/shared/utils/paginator.util';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductUpdateDto } from './dto/product.update.dto';
import { returnProductObject } from './return.product-object.select';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorWithSearchTermQuery) {
    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const products = pagination(this.prismaService.product, {
      where: {
        name: {
          contains: query.searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObject,
    });

    return products;
  }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async getByCategory(categoryId: string, query?: PaginatorQuery) {
    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const products = pagination(this.prismaService.product, {
      where: {
        category: {
          id: categoryId,
        },
      },
      select: returnProductObject,
    });

    return products;
  }

  async getMostPopular(query?: PaginatorQuery) {
    const mostPopularProducts = await this.prismaService.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const productIds = mostPopularProducts.map((item) => item.productId);

    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const products = pagination(this.prismaService.product, {
      where: {
        id: {
          in: productIds,
        },
      },
      select: returnProductObject,
    });

    return products;
  }

  async getSimilar(productId: string, query?: PaginatorQuery) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
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

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product.id;
  }

  async delete(productId: string) {
    const product = await this.prismaService.product.delete({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product.id;
  }
}
