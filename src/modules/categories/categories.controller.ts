import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { PaginatorWithSearchTermQuery } from 'src/shared/types/paginator-with-search-term.query.type';
import { CategoriesService } from './categories.service';
import { CategoryCreateDto } from './dto/categories.create.dto';
import { CategoryUpdateDto } from './dto/categories.update.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.categoriesService.getAll(query);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.categoriesService.getById(id);
  }

  @Auth()
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CategoryCreateDto) {
    return this.categoriesService.create(dto);
  }

  @Auth()
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: CategoryUpdateDto) {
    return this.categoriesService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
