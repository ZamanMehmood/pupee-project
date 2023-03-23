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
import {Provider, UserTypesEnum} from "../../enums/user.enum";





export class CreateUser {

    @IsNotEmpty()
    @IsString()
    access_token: String;

    @IsNotEmpty()
    @IsEnum(Provider)
    provider: String;
}

