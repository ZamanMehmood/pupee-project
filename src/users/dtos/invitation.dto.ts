import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    isEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import {Transform, Type} from "class-transformer";
import {validateMongoId} from "../../utils/mongo";
import { Types } from "mongoose"
import {Block, InvitationMedium, InvitationType} from "../../enums/user.enum";


class Person {


    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    id: String;

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



export class CreateInvitation {

    @IsNotEmpty()
    @IsString()
    key;


    @IsNotEmpty()
    @IsEnum(InvitationType)
    type;


    @IsNotEmpty()
    @IsEnum(InvitationMedium)
    medium;


    @IsNotEmpty()
    @ValidateNested({each: true})
    @Type(() => Person)
    userInfo;

}


export class GetInvitation {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    key;
}