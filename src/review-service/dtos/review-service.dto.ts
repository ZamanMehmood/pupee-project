import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewServiceDto {
  @IsString()
  @IsNotEmpty()
  service_id;

  @IsString()
  @IsNotEmpty()
  user_id;

  @IsString()
  @IsNotEmpty()
  order_id;

  @IsString()
  @IsNotEmpty()
  service_provider_id;

  @IsString()
  @IsNotEmpty()
  review;

  @IsNumber()
  @IsNotEmpty()
  communication;

  @IsNumber()
  @IsNotEmpty()
  service_as_described;

  @IsNumber()
  @IsNotEmpty()
  would_recomment;
}
