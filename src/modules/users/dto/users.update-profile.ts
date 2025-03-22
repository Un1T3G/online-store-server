import { IsOptional, IsString } from 'class-validator';

export class UserUpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
