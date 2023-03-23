import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppImageDto {
  @IsString()
  @IsNotEmpty()
  image_url: string;
}
