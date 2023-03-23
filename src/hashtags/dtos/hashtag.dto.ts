import {
    ArrayMinSize,
    IsArray,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import {UserTypesEnum} from '../../enums/user.enum';
import {Transform, Type} from "class-transformer";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"
import {NotificationTypeEnum} from "../../enums/notification.enum";


class ProfileInfo {



    @IsNotEmpty()
    first_name: String;


    @IsNotEmpty()
    last_name: String;


    @IsOptional()
    @IsString()
    profile_image_url: string;

    @IsOptional()
    @IsDate()
    date: Date = new Date();

}

export class CreateNotificationDto {
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    user_id: string;

    @IsEnum(NotificationTypeEnum)
    type: string;

    @IsString()
    message: string;

    @ValidateNested({each: true})
    @Type(() => ProfileInfo)
    profile_info;

    @IsOptional()
    @IsString()
    data: string;

}

export class DeleteMultiple {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    id;
}