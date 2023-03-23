import {
    ArrayMinSize,
    IsArray, IsBoolean,
    IsDate, IsEnum,
    IsNotEmpty, IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested
} from 'class-validator';
import * as mongoose from "mongoose";
import {Type, Transform} from "class-transformer";
import {Types} from "mongoose"
import {BadRequestException} from "@nestjs/common";
import {validateMongoId} from "../../utils/mongo";
import {WeddingServicesType} from "../../enums/wedding.enum";

class User {


    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    userId: String;

    @IsNotEmpty()
    first_name: String;


    @IsNotEmpty()
    last_name: String;


    @IsOptional()
    @IsString()
    profile_image_url: string;


    @IsNotEmpty()
    @IsBoolean()
    can_edit: boolean;


    @IsOptional()
    @IsDate()
    date: Date = new Date();

}


class Songs {
    @IsOptional()
    @IsString()
    title;

    @IsOptional()
    @IsString()
    sub_title;

    @IsOptional()
    @IsString()
    url;


    @IsOptional()
    @IsNumber()
    duration;
}


class Event {

    @IsOptional()
    name: String;


    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Songs)
    songs: Songs;

}


export class CreatePlaylistDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;


    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Event)
    event: Event;
}


export class AddUpdateEventDto {


    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Event)
    event: Event;
}

export class SharePlaylistDto {

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => User)
    user_to_add: User;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => User)
    user_to_remove: User;

}