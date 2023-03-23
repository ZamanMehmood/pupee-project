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

class Budget {


    @IsNotEmpty()
    @IsString()
    title: String;

    @IsNotEmpty()
    @IsNumber()
    amount: Number;


    @IsNotEmpty()
    @IsBoolean()
    confirmed: boolean;


}


export class CreateBudgetDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;


    @IsOptional()
    @IsNumber()
    total: Number;



    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Budget)
    budget: Budget;

}


export class AddUpdateBudgetDto {

    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Budget)
    budget: Budget;
}


export class UpdateBudgetTotalDto {

    @IsNotEmpty()
    @IsNumber()
    total: Number;
}