import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSearchHistoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateSearchHistoryDto {
  @IsString()
  @IsNotEmpty()
  search_history_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
