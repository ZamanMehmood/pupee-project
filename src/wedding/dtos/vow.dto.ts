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

class Detail {


    @IsNotEmpty()
    description: String;


    @IsNotEmpty()
    @IsBoolean()
    default: boolean;



}


export class CreateVowDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;


    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Detail)
    detail: Detail;

}


export class UpdateVowDto {

    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Detail)
    detail: Detail;

}
