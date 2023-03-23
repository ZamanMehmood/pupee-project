import {Expose, Transform, Type} from 'class-transformer';
import {
    IsArray,
    IsBoolean, IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import {
    ChatMessageType,
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelStatsEnum,
    ModelWeightEnum,
    OrderByEnum,
    YesNoEnum
} from "../../enums/modeling.enum";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"



class Profile{
    @IsNotEmpty()
    @IsString()
    first_name: String;

    @IsNotEmpty()
    @IsString()
    last_name: String;

    @IsNotEmpty()
    @IsString()
    profile_image_url: String;

}


export class CreateModelChatMessageDto {
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    senderId: string;

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    receiverId: string;


    @IsNotEmpty()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Profile)
    senderInfo;


    @IsNotEmpty()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Profile)
    receiverInfo;


    @IsNotEmpty()
    @IsString()
    message;

    @IsOptional()
    @IsEnum(ChatMessageType)
    type;



}

