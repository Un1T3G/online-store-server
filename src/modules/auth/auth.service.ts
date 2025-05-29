import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { UserCreateDto } from '../users/dto/users.create.dto';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRefreshTokenDto } from './dto/auth.refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return tokens;
  }

  async getNewTokens(dto: AuthRefreshTokenDto) {
    const data = await this.jwtService.verifyAsync(dto.refreshToken);

    if (!data) {
      throw new BadRequestException('Token is expired');
    }

    const tokens = await this.issueTokens(data.id);

    return tokens;
  }

  async register(dto: UserCreateDto) {
    try {
      const oldUser = await this.usersService.getByEmail(dto.email);

      if (oldUser) {
        throw new BadRequestException('User already exists');
      }
    } catch (error) {}

    const hashedPassword = await hash(dto.password!);

    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    const tokens = await this.issueTokens(user.id);

    return tokens;
  }

  async authByGoogle(req: any) {
    let user;

    try {
      user = await this.usersService.getByEmail(req.user.email);
    } catch (e) {
      const dto: UserCreateDto = {
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.picture,
      };
      user = await this.usersService.create(dto, true);
    }

    const tokens = await this.issueTokens(user.id);

    return tokens;
  }

  private async validateUser(dto: AuthLoginDto) {
    const user = await this.usersService.getByEmail(dto.email, {
      id: true,
      password: true,
    });

    const isPasswordEqual = await verify(user.password, dto.password);

    if (!isPasswordEqual) {
      throw new BadRequestException('Password is incorrect');
    }

    return user;
  }

  private async issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
