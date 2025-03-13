import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { UserUpdateAddressDto } from './dto/users.update-address';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Auth('user')
  async getProfile(@CurrentUser('id') userId) {
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  @Put('profile/address')
  @Auth('user')
  async updateAddress(
    @CurrentUser('id') userId,
    @Body() dto: UserUpdateAddressDto,
  ) {
    const id = await this.usersService.updateAddress(dto, userId);

    if (!id) {
      throw new BadRequestException('User not found');
    }

    return id;
  }
}
