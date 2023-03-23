import {IS_NUMBER, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import {Transform, Type} from "class-transformer";
import {RatingTypeEnum, WhoseRatingEnum} from "../../enums/rating.enum";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"


class WhoseRating {
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    id;


    @IsNotEmpty()
    @IsEnum(WhoseRatingEnum)
    type;
}


class UserInfo {
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    id;


    @IsNotEmpty()
    first_name;

    @IsNotEmpty()
    last_name;

    @IsString()
    @IsNotEmpty()
    user_name;

    @IsString()
    @IsNotEmpty()
    profile_image_url;

}


class Rating {

    @ValidateNested()
    @Type(() => UserInfo)
    user_info;


    @IsString()
    @IsNotEmpty()
    review;


    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    service_id;

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    order_id;

    @IsOptional()
    @IsNumber()
    communication;

    @IsOptional()
    @IsNumber()
    service_as_described;

    @IsOptional()
    @IsNumber()
    would_recommend;

}


export class CreateRating {

    @IsNotEmpty()
    @IsString()
    rating_id;

    @IsNotEmpty()
    @IsEnum(RatingTypeEnum)
    type;

    @IsOptional()
    @ValidateNested()
    @Type(() => Rating)
    rating;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WhoseRating)
    whose_rating;

}

