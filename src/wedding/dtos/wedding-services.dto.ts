import {
    ArrayMinSize,
    IsArray,
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





export class AddWeddingReceptionDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;

    @IsNotEmpty()
    @IsString()
    title: String;

    @IsNotEmpty()
    @IsString()
    logo: String;

    @IsArray()
    @ArrayMinSize(1)
    tags: String[];

    @IsOptional()
    @IsNumber()
    rating: Number;

    @IsOptional()
    @IsNumber()
    comments_count: Number;


    @IsNotEmpty()
    @IsString()
    date_created: String;

    @IsNotEmpty()
    @IsString()
    address: String;


    @IsNotEmpty()
    @IsString()
    video: String;

    @IsArray()
    @ArrayMinSize(1)
    past_work: String[];


    @IsNotEmpty()
    @IsEnum(WeddingServicesType)
    type

}


export class UpdateWeddingServicesUpdate {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingServiceId: String;


    @IsNotEmpty()
    @IsString()
    title: String;

    @IsNotEmpty()
    @IsString()
    logo: String;

    @IsArray()
    @ArrayMinSize(1)
    tags: String[];

    @IsOptional()
    @IsNumber()
    rating: Number;

    @IsOptional()
    @IsNumber()
    comments_count: Number;


    @IsNotEmpty()
    @IsString()
    date_created: String;

    @IsNotEmpty()
    @IsString()
    address: String;


    @IsNotEmpty()
    @IsString()
    video: String;

    @IsArray()
    @ArrayMinSize(1)
    past_work: String[];

}
