import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWithdrawMethodDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  account_number: string;
}

export class UpdateWithdrawMethodDto {
  @IsString()
  @IsNotEmpty()
  withdraw_method_id: string;

  @IsString()
  bank_name: string;

  @IsString()
  account_number: string;
}

export class UpdateWithdrawMethodDefaultDto {
  @IsString()
  @IsNotEmpty()
  withdraw_method_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
