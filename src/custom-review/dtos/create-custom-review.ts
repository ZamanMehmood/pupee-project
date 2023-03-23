import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomReviewDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
