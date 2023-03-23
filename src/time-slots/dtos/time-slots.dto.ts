import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeSlotsDto {
  @IsString()
  @IsNotEmpty()
  service_id;

  @IsString()
  @IsNotEmpty()
  time_slot;
}
