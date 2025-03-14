import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductUpdateDto } from './dto/product.update.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string, @Query() query?: PaginatorQuery) {
    const products = await this.getSimilar(id, query);

    if (!products) {
      throw new BadRequestException('Product not found');
    }

    return products;
  }

  @Auth('admin')
  @Post()
  async create(@Body() dto: ProductCreateDto) {
    return this.productsService.create(dto);
  }

  @Auth('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ProductUpdateDto) {
    const productId = await this.productsService.update(dto, id);

    if (!productId) {
      throw new BadRequestException('Product not found');
    }

    return productId;
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const productId = await this.productsService.delete(id);

    if (!productId) {
      throw new BadRequestException('Product not found');
    }

    return productId;
  }
}
