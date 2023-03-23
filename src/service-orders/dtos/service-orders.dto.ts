import {
    ArrayMinSize,
    IsArray, IsBoolean,
    IsDate, IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString, ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';



import {STATUS} from '../models/service-orders.model';
import {Prop} from '@nestjs/mongoose';
import {Block} from "../../enums/user.enum";
import {UpdateServiceDto} from "../../services/dtos/services.dto";

export class CreateServiceOrderDto {
    @IsString()
    @IsNotEmpty()
    user_id;

    @IsString()
    @IsNotEmpty()
    service_provider_id;

    @IsString()
    @IsNotEmpty()
    service_id;

    @IsString()
    @IsNotEmpty()
    instant_or_schedule_service;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    date;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    stripe_token;

    @IsNumber()
    @IsNotEmpty()
    service_price;

    @IsString()
    @IsNotEmpty()
    time_slot;

    @IsString()
    @IsNotEmpty()
    description;

    @IsNumber()
    @IsNotEmpty()
    total_price;

    @IsString()
    @IsNotEmpty()
    payment_method;

    @IsString()
    @IsOptional()
    cover_image;

    @IsString()
    @IsOptional()
    address;

    @IsString()
    @IsOptional()
    title;

    @IsNumber()
    @IsOptional()
    service_charges;

    @IsNumber()
    @IsOptional()
    discount;

    @IsString()
    @IsNotEmpty()
    deadline_date;


    @IsBoolean()
    @IsOptional()
    customer_reviewed;

    @IsString()
    @IsOptional()
    occupation;

    @IsOptional()
    @IsDateString()
    decline_date;


}


class StatusHistory {

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsArray()
    asset: string;

    @IsOptional()
    @IsDate()
    date: Date=new Date();

}

export class UpdateServiceOrderDto {
    @IsString()
    @IsNotEmpty()
    service_order_id;


    @IsString()
    @IsNotEmpty()
    status;

    @IsBoolean()
    @IsOptional()
    customer_reviewed;

    @IsEnum(Block)
    @IsOptional()
    blocked;


    @ValidateNested()
    @Type(() => StatusHistory)
    history;


    @IsOptional()
    @IsDateString()
    decline_date;


}



export class UpdateMultipleServiceOrdersDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => UpdateServiceOrderDto)
    serviceOrders;
}

