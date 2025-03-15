import { IsNotEmpty, IsString } from 'class-validator';

export class ColorCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
