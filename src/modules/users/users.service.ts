import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserCreateDto } from './dto/users.create.dto';
import { UserUpdateAddressDto } from './dto/users.update-address';
import { UserUpdateProfileDto } from './dto/users.update-profile';
import { returnUserObject } from './return.user-object.select';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string, select: Prisma.UserSelect = returnUserObject) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async getByEmail(
    email: string,
    select: Prisma.UserSelect = returnUserObject,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async create(dto: UserCreateDto, authByOAuth: boolean = false) {
    const user = await this.prismaService.user.create({
      data: {
        ...dto,
        avatarUrl: dto.avatarUrl || '/avatar/default.png',
        authByOAuth,
      },
      select: returnUserObject,
    });

    return user;
  }

  async updateProfile(dto: UserUpdateProfileDto, id: string) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: dto,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.id;
  }

  async updateAddress(dto: UserUpdateAddressDto, id: string) {
    const user = await this.prismaService.user.update({
      where: { id },
      select: returnUserObject,
      data: {
        address: {
          upsert: {
            create: dto,
            update: dto,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.id;
  }

  async toggleFavorite(userId: string, productId: string) {
    const user = await this.getById(userId, {
      id: true,
      favorites: true,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isExists = user.favorites.some((product) => product.id === productId);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });

    return true;
  }
}
