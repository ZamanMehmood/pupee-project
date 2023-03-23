import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceOrderMessageDto {
  @IsString()
  @IsNotEmpty()
  conversation_id;

  @IsString()
  @IsNotEmpty()
  message_text;

  @IsString()
  @IsNotEmpty()
  sender;

  @IsString()
  @IsNotEmpty()
  receiver;
}
