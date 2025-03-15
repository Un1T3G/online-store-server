import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
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
    return this.usersService.getById(userId);
  }

  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.usersService.toggleFavorite(userId, productId);
  }

  @Put('profile/address')
  @Auth('user')
  async updateAddress(
    @CurrentUser('id') userId,
    @Body() dto: UserUpdateAddressDto,
  ) {
    return this.usersService.updateAddress(dto, userId);
  }
}
