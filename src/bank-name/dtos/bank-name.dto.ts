import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBankNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
