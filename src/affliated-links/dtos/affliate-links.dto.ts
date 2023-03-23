import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAffliateLinkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  website_link: string;
}
