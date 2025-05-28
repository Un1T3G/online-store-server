import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatbotModule } from 'src/modules/chatbot/chatbot.module';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { AuthModule } from '../modules/auth/auth.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ColorsModule } from '../modules/colors/colors.module';
import { FilesModule } from '../modules/files/files.module';
import { ProductsModule } from '../modules/products/products.module';
import { ReviewsModule } from '../modules/reviews/reviews.module';
import { StatisticsModule } from '../modules/statistics/statistics.module';
import { UsersModule } from '../modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ColorsModule,
    ReviewsModule,
    FilesModule,
    ProductsModule,
    OrdersModule,
    StatisticsModule,
    ChatbotModule,
  ],
})
export class CoreModule {}
