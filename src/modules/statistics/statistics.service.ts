import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { PrismaService } from 'src/core/prisma/prisma.service';

dayjs.locale('ru');

const monthNames = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMainStatistics() {
    const totalRevenue = await this.calculateTotalRevenue();

    const productsCount = await this.countProducts();
    const categoriesCount = await this.countCategories();

    const averageRating = await this.calculateAverageRating();

    return [
      { id: 1, name: 'revenue', value: totalRevenue },
      { id: 2, name: 'products', value: productsCount },
      { id: 3, name: 'categories', value: categoriesCount },
      { id: 4, name: 'average_rating', value: averageRating || 0 },
    ];
  }

  async getMiddleStatistics() {
    const monthlySales = await this.calculateMonthlySales();

    const lastUsers = await this.getLastUsers();

    return { monthlySales, lastUsers };
  }

  private async calculateTotalRevenue() {
    const orders = await this.prismaService.order.findMany({
      include: {
        items: true,
      },
    });

    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.items.reduce((itemAcc, item) => {
        return itemAcc + item.price * item.quantity;
      }, 0);
      return acc + total;
    }, 0);

    return totalRevenue;
  }

  private async countProducts() {
    const productsCount = await this.prismaService.product.count();
    return productsCount;
  }

  private async countCategories() {
    const categoriesCount = await this.prismaService.category.count();
    return categoriesCount;
  }

  private async calculateAverageRating() {
    const averageRating = await this.prismaService.review.aggregate({
      _avg: { rating: true },
    });

    return averageRating._avg.rating;
  }

  private async calculateMonthlySales() {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    const formatDate = (date: Date): string => {
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    };

    const salesByDate = new Map<string, number>();

    salesRaw.forEach((order) => {
      const formattedDate = formatDate(new Date(order.createdAt));

      const total = order.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      if (salesByDate.has(formattedDate)) {
        salesByDate.set(formattedDate, salesByDate.get(formattedDate)! + total);
      } else {
        salesByDate.set(formattedDate, total);
      }
    });

    const monthlySales = Array.from(salesByDate, ([date, value]) => ({
      date,
      value,
    }));

    return monthlySales;
  }

  private async getLastUsers() {
    const lastUsers = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orders: {
          include: {
            items: {
              select: { price: true },
            },
          },
        },
      },
    });

    return lastUsers.map((user) => {
      let total = 0;

      if (user.orders.length > 0) {
        const lastOrder = user.orders[user.orders.length - 1];
        total = lastOrder.items.reduce((total, item) => {
          return total + item.price;
        }, 0);
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        total,
      };
    });
  }
}
