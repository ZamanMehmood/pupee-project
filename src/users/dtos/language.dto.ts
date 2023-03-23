import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateLanguageDto {
  @IsString()
  @IsNotEmpty()
  language_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
