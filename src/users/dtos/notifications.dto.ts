import {IsBoolean, IsEmail, IsNotEmpty, IsString, ValidateNested} from 'class-validator';
import {Transform, Type} from "class-transformer";
import {validateMongoId} from "../../utils/mongo";
import { Types } from "mongoose"


class notification{
    @IsBoolean()
    @IsNotEmpty()
    enable_notification: boolean;

    @IsBoolean()
    @IsNotEmpty()
    new_post_to_review: boolean;

    @IsBoolean()
    @IsNotEmpty()
    new_comments: boolean;

    @IsBoolean()
    @IsNotEmpty()
    new_likes: boolean;


    @IsBoolean()
    @IsNotEmpty()
    new_reviews: boolean;



    @IsBoolean()
    @IsNotEmpty()
    new_messages: boolean;


    @IsBoolean()
    @IsNotEmpty()
    app_update: boolean;


    @IsBoolean()
    @IsNotEmpty()
    automatic_update: boolean;


    @IsBoolean()
    @IsNotEmpty()
    automatically_add_new_contact: boolean;


}


export class UpdateNotificationSetting {

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    userId: String;

    @ValidateNested()
    @Type(() => notification)
    notification_setting;




}
