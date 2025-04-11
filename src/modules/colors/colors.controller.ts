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
import { ColorsService } from './colors.service';
import { ColorCreateDto } from './dto/colors.create.dto';
import { ColorUpdateDto } from './dto/colors.update.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.colorsService.getAll(query);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.colorsService.getById(id);
  }

  @Auth()
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: ColorCreateDto) {
    return this.colorsService.create(dto);
  }

  @Auth()
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: ColorUpdateDto) {
    return this.colorsService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.colorsService.delete(id);
  }
}
