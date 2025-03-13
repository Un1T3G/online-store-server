import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserCreateDto } from './dto/users.create.dto';
import { UserUpdateAddressDto } from './dto/users.update-address';
import { returnUserObject } from './return.user-object.select';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string, select: Prisma.UserSelect = returnUserObject) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select,
    });

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

    return user;
  }

  async create(dto: UserCreateDto, authByOAuth: boolean = false) {
    const user = await this.prismaService.user.create({
      data: {
        ...dto,
        avatarUrl: dto.avatarUrl || '',
        authByOAuth,
      },
      select: returnUserObject,
    });

    return user;
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

    return user ? id : null;
  }
}
