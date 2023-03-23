import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {Role, StorageEnum} from "../../enums/user.enum";
import {Transform, Type} from "class-transformer";
import {validateMongoId} from "../../utils/mongo";
import { Types } from "mongoose"

export class CreateStorage {
    @IsNumber()
    @IsNotEmpty()
    price_per_month;

    @IsNumber()
    @IsNotEmpty()
    price_per_year;

    @IsNumber()
    @IsNotEmpty()
    storage;

    @IsString()
    @IsNotEmpty()
    title;

    @IsNumber()
    @IsNotEmpty()
    discount;


    @IsNumber()
    @IsNotEmpty()
    service_charges;

}

export class UpdateStorage {
    @IsNumber()
    @IsOptional()
    price_per_month;

    @IsNumber()
    @IsOptional()
    price_per_year;

    @IsNumber()
    @IsOptional()
    storage;

    @IsString()
    @IsOptional()
    title;

    @IsNumber()
    @IsOptional()
    discount;


    @IsNumber()
    @IsOptional()
    service_charges;

}



export class BuyStorageDto {
    @IsEnum(StorageEnum)
    @IsNotEmpty()
    plan;
}