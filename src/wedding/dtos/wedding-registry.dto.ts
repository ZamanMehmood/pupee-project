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





export class AddWeddingRegistry {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;

    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsString()
    description: String;

    @IsOptional()
    @IsString()
    link: String;
}


export class UpdateWeddingRegistry {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingRegistryId: String;

    @IsOptional()
    @IsString()
    name: String;

    @IsOptional()
    @IsString()
    description: String;

    @IsOptional()
    @IsString()
    link: String;


}
