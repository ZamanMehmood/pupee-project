import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  post_id: string;

  @IsArray()
  @IsNotEmpty()
  reviews: [string];
}

export class UpdateReviewDto {
  @IsString()
  @IsNotEmpty()
  review_id: string;

  @IsString()
  @IsNotEmpty()
  product_name: string;
}

export class LikeReviewDto {
  @IsString()
  @IsNotEmpty()
  review_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
