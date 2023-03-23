import {
    ArrayMinSize,
    IsArray,
    IsBoolean, IsEnum,
    IsNotEmpty,
    isNumber,
    IsNumber,
    IsObject,
    IsOptional,
    IsString, ValidateNested,
} from 'class-validator';
import {Block} from "../../enums/user.enum";
import {Type} from "class-transformer";
import {UpdatePostDto} from "../../posts/dtos/posts.dto";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    user_id;

    @IsString()
    @IsNotEmpty()
    photo;

    @IsString()
    @IsNotEmpty()
    you_offering;

    @IsString()
    @IsNotEmpty()
    service_description;

    @IsString()
    @IsNotEmpty()
    instant_or_schedule_service;

    @IsBoolean()
    @IsNotEmpty()
    traver_for_service;

    @IsNumber()
    @IsNotEmpty()
    base_price;

    @IsArray()
    @IsNotEmpty()
    add_on;

    @IsArray()
    @IsOptional()
    packages;

    @IsNumber()
    @IsOptional()
    average_rating;

    @IsNumber()
    @IsOptional()
    reviews_count;

    @IsString()
    @IsOptional()
    location;


    @IsString()
    @IsOptional()
    occupation;

}


export class UpdateServiceDto {

    @IsString()
    @IsNotEmpty()
    serviceId;


    @IsString()
    @IsOptional()
    photo;

    @IsString()
    @IsOptional()
    you_offering;

    @IsString()
    @IsOptional()
    service_description;

    @IsString()
    @IsOptional()
    instant_or_schedule_service;

    @IsBoolean()
    @IsOptional()
    traver_for_service;

    @IsNumber()
    @IsOptional()
    base_price;

    @IsArray()
    @IsOptional()
    add_on;

    @IsArray()
    @IsOptional()
    packages;

    @IsNumber()
    @IsOptional()
    average_rating;

    @IsNumber()
    @IsOptional()
    reviews_count;

    @IsString()
    @IsOptional()
    location;

    @IsOptional()
    @IsEnum(Block)
    blocked;
}



export class UpdateMultipleServicesDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => UpdateServiceDto)
    services;
}