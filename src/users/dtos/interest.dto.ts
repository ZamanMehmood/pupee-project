import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateInterestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateInterestDto {
  @IsString()
  @IsNotEmpty()
  interest_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
