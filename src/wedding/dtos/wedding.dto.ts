import {
    ArrayMinSize,
    IsArray,
    IsDate,
    IsNotEmpty,
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


class Partner {


    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    id: String;

    @IsNotEmpty()
    first_name: String;


    @IsNotEmpty()
    last_name: String;


    @IsOptional()
    @IsString()
    profile_image_url: string;

    @IsOptional()
    @IsDate()
    date: Date = new Date();

}


class Relation {

    @IsNotEmpty()
    @IsString()
    label: String;

    @IsNotEmpty()
    @IsString()
    value: String;
}

class Location {
    @IsNotEmpty()
    lat: Number;

    @IsNotEmpty()
    lng: Number;
}


class Recipient {
    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Relation)
    relation: Relation;

    @IsNotEmpty()
    first_name: String;

    @IsNotEmpty()
    last_name: String;

    @IsOptional()
    phone_number: String;

    @IsNotEmpty()
    email: String;
}


class CheckList {
    @IsNotEmpty()
    title: String;

    @IsNotEmpty()
    booked: Boolean;
}


export class CreateWeddingDto {
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Partner)
    partner: Partner;


    @ValidateNested({each: true})
    @Type(() => Partner)
    profile;


    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    userId: String;

    @IsOptional()
    @IsString()
    title: String;

    @IsNotEmpty()
    date: String;

    @ValidateNested({each: true})
    @Type(() => Location)
    location: Location;

    @IsNotEmpty()
    description: String;

    @IsNotEmpty()
    number_of_guests: String;

    @IsNotEmpty()
    budget: String;

    @IsNotEmpty()
    country: String;

    @IsNotEmpty()
    state: String;

    @IsNotEmpty()
    city: String;

    @IsNotEmpty()
    venue_name: String;

    @IsNotEmpty()
    address: String;

    @IsOptional()
    engagement_date: String;

    @IsOptional()
    wedding_date: String;
}


export class UpdateWeddingDto {
    @IsOptional()
    @IsString()
    engagement_date: String;

    @IsOptional()
    @IsString()
    wedding_date: String;

    @IsOptional()
    @IsString()
    wedding_time: String;

    @IsOptional()
    @IsString()
    ceremony_location: String;

    @IsOptional()
    @IsString()
    ceremony_address: String;

    @IsOptional()
    @IsString()
    ceremony_location_google: String;

    @IsOptional()
    @IsString()
    reception_venue_name: String;

    @IsOptional()
    @IsString()
    reception_venue_address: String;

    @IsOptional()
    @IsString()
    reception_venue_google: String;


    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Partner)
    partner: Partner;


    @IsOptional()
    @IsString()
    title: String;


}


export class UpdateRecipientDto {
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Recipient)
    recipient: Recipient;

    @IsOptional()
    announcement: String;
}


export class UpdateCheckListDto {
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => CheckList)
    checkList: CheckList;
}

export class UpdateChecklistStatusDto {

    @IsNotEmpty()
    booked: Boolean;
}

export class UpdateWeddingVowsDto {

    @IsNotEmpty()
    @IsString()
    vows: String;
}


export class SendAnnouncementDto {

    @IsNotEmpty()
    @IsString()
    wedding_date: String;

    @IsNotEmpty()
    @IsString()
    engagement_date: String;

}