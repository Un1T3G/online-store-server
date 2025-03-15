import {
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

import { PaginatorWithSearchTermQuery } from 'src/shared/types/paginator-with-search-term.query.type';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.productsService.getAll(query);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @Get('by-category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: string,
    query?: PaginatorQuery,
  ) {
    return this.productsService.getByCategory(categoryId, query);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.productsService.getMostPopular();
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string, @Query() query?: PaginatorQuery) {
    return this.productsService.getSimilar(id, query);
  }

  @Auth('admin')
  @Post()
  async create(@Body() dto: ProductCreateDto) {
    return this.productsService.create(dto);
  }

  @Auth('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ProductUpdateDto) {
    return this.productsService.update(dto, id);
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
