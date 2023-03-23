import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAdvertiseServiceDto {
  @IsString()
  @IsNotEmpty()
  user_id;

  @IsString()
  @IsOptional()
  service_id;

  @IsString()
  @IsOptional()
  service_name;

  @IsNumber()
  @IsOptional()
  age_min;

  @IsNumber()
  @IsOptional()
  age_max;

  @IsString()
  @IsOptional()
  gender;

  @IsArray()
  @IsOptional()
  occupations;

  @IsArray()
  @IsOptional()
  interests;

  @IsArray()
  @IsOptional()
  keywords;

  @IsArray()
  @IsOptional()
  search_history;

  @IsObject()
  @IsOptional()
  selected_audience;

  @IsString()
  @IsOptional()
  business_category;

  @IsString()
  @IsOptional()
  start_date;

  @IsString()
  @IsOptional()
  goal;

  @IsString()
  @IsOptional()
  Stripe_token;

  @IsString()
  @IsOptional()
  total_budget;

  @IsNumber()
  @IsOptional()
  duration;
}

export class UpdateAdvertiseServiceDto {
  @IsString()
  @IsNotEmpty()
  advertise_service_id;

  @IsString()
  @IsOptional()
  service_name;

  @IsNumber()
  @IsOptional()
  age_min;

  @IsNumber()
  @IsOptional()
  age_max;

  @IsString()
  @IsOptional()
  gender;

  @IsArray()
  @IsOptional()
  occupations;

  @IsArray()
  @IsOptional()
  interests;

  @IsArray()
  @IsOptional()
  keywords;

  @IsArray()
  @IsOptional()
  search_history;

  @IsObject()
  @IsOptional()
  selected_audience;

  @IsString()
  @IsOptional()
  business_category;

  @IsString()
  @IsOptional()
  start_date;

  @IsString()
  @IsOptional()
  total_budget;

  @IsNumber()
  @IsOptional()
  duration;

  @IsString()
  @IsOptional()
  goal;

  @IsString()
  @IsOptional()
  Stripe_token;
}
