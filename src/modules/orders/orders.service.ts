import { Injectable } from '@nestjs/common';
import { EnumOrderStatus } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginatorQuery } from 'src/shared/types/paginator.query.type';
import { paginator } from 'src/shared/utils/paginator.util';
import * as YooKassa from 'yookassa';
import { returnUserObject } from '../users/return.user-object.select';
import { OrderCreateDto } from './dto/order.create.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { returnOrderObject } from './return.order-object.select';

const yooKassa = new YooKassa({
  shopId: process.env['YOOKASSA_SHOP_ID'],
  secretKey: process.env['YOOKASSA_SECRET_KEY'],
});

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorQuery) {
    const pagination = paginator({ page: query.page, perPage: query.perPage });

    const orders = pagination(this.prismaService.order, {
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        ...returnOrderObject,
        user: {
          select: returnUserObject,
        },
      },
    });

    return orders;
  }

  async getByUserId(userId: string) {
    const orders = await this.prismaService.order.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: returnOrderObject,
    });

    return orders;
  }

  async createPayment(dto: OrderCreateDto, userId: string) {
    const orderItems = dto.items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
    }));

    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = await this.prismaService.order.create({
      data: {
        status: EnumOrderStatus.PENDING,
        items: {
          create: orderItems,
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const rubToSumCurrency = 158.86;

    const payment = await yooKassa.createPayment({
      amount: {
        value: (total / rubToSumCurrency).toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env['CLIENT_URL']}/thanks`,
      },
      description: `Оплата заказа в магазине Fake-Store. Id платежи: #${order.id}`,
    });

    return payment;
  }

  async updateStatus(dto: PaymentStatusDto) {
    if (dto.event === 'payment.waiting_for_capture') {
      const payment = await yooKassa.capturePayment(dto.object.id);
      return payment;
    }

    if (dto.event === 'payment.succeeded') {
      const descriptionParts = dto.object.description.split(', ');
      const orderId = descriptionParts[0].split('#')[1];

      await this.prismaService.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: EnumOrderStatus.PAYED,
        },
      });

      return true;
    }

    return true;
  }
}
