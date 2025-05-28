import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatbotDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  language?: string;
}
