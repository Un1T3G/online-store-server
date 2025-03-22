import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { ReviewCreateDto } from './dto/review.create.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Auth('admin')
  @Get()
  async getAll(@Query() query: PaginatorQuery) {
    return this.reviewsService.getAll(query);
  }

  @Get('by-product/:productId')
  async getByProductId(
    @Param('productId') productId: string,
    @Query() query?: PaginatorQuery,
  ) {
    return this.reviewsService.getByProductId(productId, query);
  }

  @Auth()
  @Post(':productId/')
  @UsePipes(new ValidationPipe())
  async create(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: ReviewCreateDto,
  ) {
    return this.reviewsService.create(dto, userId, productId);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
