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


class Album {

    @IsNotEmpty()
    @IsString()
    type;

    @IsNotEmpty()
    @IsString()
    asset;
}



export class CreateWeddingAlbumDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;

    @IsNotEmpty()
    @IsString()
    title: String;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Album)
    album: Album;


}


export class UpdateWeddingAlbumDto {



    @IsOptional()
    @IsString()
    title: String;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Album)
    album: [Album];

}


export class ShareAlbumDto {



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