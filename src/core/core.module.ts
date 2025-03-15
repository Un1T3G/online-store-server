import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { ColorsModule } from 'src/modules/colors/colors.module';
import { FilesModule } from 'src/modules/files/files.module';
import { ProductsModule } from 'src/modules/products/products.module';
import { ReviewsModule } from 'src/modules/reviews/reviews.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { UsersModule } from 'src/modules/users/users.module';
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
    StatisticsModule,
  ],
})
export class CoreModule {}
