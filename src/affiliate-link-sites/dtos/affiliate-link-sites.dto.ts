import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAffliateLinkSiteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
