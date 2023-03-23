import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeywordDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateKeywordDto {
  @IsString()
  @IsNotEmpty()
  keyword_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
