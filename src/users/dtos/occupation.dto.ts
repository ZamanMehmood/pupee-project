import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOccupationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateOccupationDto {
  @IsString()
  @IsNotEmpty()
  occupation_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
