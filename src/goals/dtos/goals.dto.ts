import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateGoalDto {
  @IsString()
  @IsNotEmpty()
  goal_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
