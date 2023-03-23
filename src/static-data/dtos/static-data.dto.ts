import {IsEnum, IsNotEmpty, IsString} from 'class-validator';
import {StaticDataEnum} from "../../enums/user.enum";

export class CreateStaticDataDto {
    @IsNotEmpty()
    @IsEnum(StaticDataEnum)
    type: string;

    @IsNotEmpty()
    @IsString()
    data: string;

}
