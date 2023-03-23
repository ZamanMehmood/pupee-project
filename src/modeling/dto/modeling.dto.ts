import {
    ArrayMinSize,
    IsArray, IsBoolean,
    IsDate, IsDateString, IsEnum,
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
import {
    ApprovalStatus, AssetType, BuyPortfolioType,
    DefaultUnit,
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelWeightEnum,
    OfflineDaysEnumType,
    YesNoEnum
} from "../../enums/modeling.enum";
import {WorkTypeLookingForType} from "../models/modeling.model";

class Height {

    @IsNotEmpty()
    @IsEnum(ModelHeightEnum)
    unit: String;


    @IsNotEmpty()
    @IsNumber()
    value;

}


class DateOfBirth {

    @IsNotEmpty()
    @IsBoolean()
    hide;


    @IsNotEmpty()
    @IsDateString()
    value;

}


class OfflineDto {

    @IsOptional()
    @IsEnum(OfflineDaysEnumType)
    days;


    @IsOptional()
    @IsDateString()
    date_from;

}


class SizeType {
    @IsNotEmpty()
    @IsEnum(ModelBodySizeEnum)
    unit: String;

    @IsNotEmpty()
    @IsNumber()
    value;

}

class Weight {
    @IsNotEmpty()
    @IsEnum(ModelWeightEnum)
    unit: String;

    @IsNotEmpty()
    @IsNumber()
    value;
}


class Color {


    @IsNotEmpty()
    @IsString()
    hair_color: String;

    @IsNotEmpty()
    @IsString()
    eye_color: String;

    @IsNotEmpty()
    @IsString()
    skin_color: String;

}


class Size {
    @IsOptional()
    @IsString()
    dress: String;

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    pants;

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    jeans;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    bra;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    bust;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    chest;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    waist;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    hips;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => SizeType)
    shoes;


    @IsOptional()
    @IsString()
    shirt;


    @IsOptional()
    @IsString()
    t_shirt;


}


class WorkTypeLookingFor {
    @IsNotEmpty()
    @IsString()
    key: String;

    @IsNotEmpty()
    @IsBoolean()
    value: Boolean;
}


class LicensePricing {
    @IsNotEmpty()
    @IsNumber()
    value: String;

    @IsNotEmpty()
    @IsBoolean()
    selected: Boolean;
}


export class UpdatePortfolioDto {

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => UpdatePortfolio)
    portfolio
}



export class AddModelPortfolio {


    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Portfolio)
    portfolio;

}


class UpdatePortfolio {

    @IsNotEmpty()
    @IsString()
    _id: String;


    @IsOptional()
    @IsString()
    asset: String;

    @IsOptional()
    @IsBoolean()
    hide: Boolean;

    @IsOptional()
    @IsBoolean()
    for_sale: Boolean;

    @IsOptional()
    @IsBoolean()
    can_contact_directly: Boolean;

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => LicensePricing)
    single_use;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => LicensePricing)
    unlimited_use_country;


    @IsNotEmpty()
    @IsEnum(AssetType)
    type;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => LicensePricing)
    unlimited_use_global;

}

class Portfolio {
    @IsNotEmpty()
    @IsString()
    asset: String;

    @IsOptional()
    @IsBoolean()
    hide: Boolean;

    @IsOptional()
    @IsBoolean()
    for_sale: Boolean;

    @IsOptional()
    @IsBoolean()
    can_contact_directly: Boolean;

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => LicensePricing)
    single_use;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => LicensePricing)
    unlimited_use_country;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => LicensePricing)
    unlimited_use_global;

}



class CustomOffers {
    @IsNotEmpty()
    @IsString()
    pricing_model;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    countries;



    @IsNotEmpty()
    @IsNumber()
    price;


    @IsOptional()
    @IsArray()
    members;


}

class FeesRights {
    @IsOptional()
    @IsNumber()
    casual_rate;

    @IsOptional()
    @IsNumber()
    half_day;

    @IsOptional()
    @IsNumber()
    full_day;

    @IsOptional()
    @IsNumber()
    weekly;

    @IsOptional()
    @IsNumber()
    additional_pictures;


    @IsOptional()
    @IsNumber()
    additional_videos;


    @IsOptional()
    @IsNumber()
    makeup_allowance;



    @IsOptional()
    @IsNumber()
    clothing_allowance;



    @IsOptional()
    @IsNumber()
    travel_allowance;



    @IsOptional()
    @IsBoolean()
    catalogue_rights;

    @IsOptional()
    @IsBoolean()
    country_rights;


    @IsOptional()
    @IsBoolean()
    global_rights;


    @IsOptional()
    @IsNumber()
    cancellation_fees;


    @IsOptional()
    @IsBoolean()
    accept_custom_offers;



    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CustomOffers)
    custom_offers;




}



class PastExperience {
    @IsOptional()
    @IsString()
    photographic: String;

    @IsOptional()
    @IsString()
    film: String;

    @IsOptional()
    @IsString()
    other: String;

}


class Questionnaires {
    @IsOptional()
    @IsString()
    what_makes_you_unique: String;

    @IsOptional()
    @IsString()
    why_choose_modeling: String;

    @IsOptional()
    @IsString()
    favourite_childhood_memory: String;


    @IsOptional()
    @IsString()
    aspire_to_meet: String;


    @IsOptional()
    @IsString()
    favourite_role_model: String;

    @IsOptional()
    @IsString()
    your_strengths: String;

    @IsOptional()
    @IsString()
    favourite_animal: String;

    @IsOptional()
    @IsString()
    give_up_to_choose_modeling: String;


    @IsOptional()
    @IsString()
    favourite_movie: String;

    @IsOptional()
    @IsString()
    like_to_live: String;


    @IsOptional()
    @IsString()
    favourite_dish: String;


}


class Model {
    @IsOptional()
    @IsString()
    selected_category;


    @IsOptional()
    @IsString()
    fashion_work;


    @IsOptional()
    @IsBoolean()
    is_advance_filter_fee_paid;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => DateOfBirth)
    birth_date;


    @IsOptional()
    @IsString()
    current_city;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Height)
    height: Height;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Weight)
    weight: Weight;

    @IsOptional()
    @IsArray()
    languages_spoken;


    @IsOptional()
    @IsString()
    race;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Color)
    color: Color;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Size)
    size: Size;


    @IsOptional()
    @IsEnum(YesNoEnum)
    piercing;


    @IsOptional()
    @IsEnum(YesNoEnum)
    tattoos;


    @IsOptional()
    @IsString()
    piercing_tattoos_description;


    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => WorkTypeLookingFor)
    work_type_looking_for: WorkTypeLookingFor;

    @IsOptional()
    @IsString()
    comments;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => PastExperience)
    past_experience;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Questionnaires)
    questionnaires;


    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Portfolio)
    portfolio;



    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => FeesRights)
    fees_rights;


    @IsOptional()
    @IsNumber()
    rating;


    @IsOptional()
    @IsNumber()
    age;


    @IsOptional()
    @IsArray()
    pitch_video;


    @IsOptional()
    @IsString()
    profile_image;

    @IsOptional()
    @IsString()
    cover_photo;

    @IsOptional()
    @IsEnum(DefaultUnit)
    default_unit;


    @IsOptional()
    @IsEnum(ApprovalStatus)
    approval_status;



    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => OfflineDto)
    offline;


}

export class CreateModelDto {

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    userId: String;

    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Model)
    model;


}


export class UpdateModelDto {

    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Model)
    model;
}


export class AddVoteDto {
    @IsNotEmpty()
    @IsString()
    date: String;

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    userId: String;

}


class Search {
    @IsNotEmpty()
    @IsString()
    title;

    @IsNotEmpty()
    @IsString()
    query;


    @IsNotEmpty()
    @IsNumber()
    result_count;
}

export class AddSearchDto {
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Search)
    saved_searches;

}


class RatingCategory {
    @IsNotEmpty()
    @IsString()
    title;

    @IsOptional()
    @IsString()
    query;

}

export class AddRatingCategoryDto {
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => RatingCategory)
    category;

}



export class BuyPortfolio {


    @IsNotEmpty()
    @IsEnum(BuyPortfolioType)
    portfolio_type;


    @IsNotEmpty()
    @IsString()
    country;

}