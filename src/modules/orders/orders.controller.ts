import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { OrderCreateDto } from './dto/order.create.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth('admin')
  @Get()
  async getAll(@Query() query: PaginatorQuery) {
    return this.ordersService.getAll(query);
  }

  @Auth('user')
  @Get('by-user')
  async getByUserId(@CurrentUser('id') userId: string) {
    return this.ordersService.getByUserId(userId);
  }

  @Post('place')
  @Auth()
  @UsePipes(new ValidationPipe())
  async checkout(
    @Body() dto: OrderCreateDto,
    @CurrentUser('id') userId: string,
  ) {
    console.log(dto);
    return this.ordersService.createPayment(dto, userId);
  }

  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return this.ordersService.updateStatus(dto);
  }
}
