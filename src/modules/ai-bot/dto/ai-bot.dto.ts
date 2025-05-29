import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AIbotDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  language?: string;
}
