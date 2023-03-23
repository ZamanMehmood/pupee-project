import {Expose, Transform, Type} from 'class-transformer';
import {
    IsArray,
    IsBoolean, IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import {
    FilterSearchType,
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelWeightEnum,
    OrderByEnum
} from "../../enums/modeling.enum";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"



class CitiesCountries {

    @IsOptional()
    @IsArray()
    cities;

    @IsOptional()
    @IsArray()
    countries;

}


class CustomRadius {

    @IsString()
    address;

    @IsNumber()
    latitude;

    @IsNumber()
    longitude;


    @IsNumber()
    distance;

}


class NearBy {

    @IsNumber()
    latitude;

    @IsNumber()
    longitude;
}


class Filter {

    @IsOptional()
    @IsString()
    min_rating;

    @IsOptional()
    @IsString()
    looking_for;

    @IsOptional()
    @IsString()
    availability_date;

}


class SearchArea {

    @IsOptional()
    @IsBoolean()
    local;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CitiesCountries)
    cities_countries;

    @IsOptional()
    @IsBoolean()
    global;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CustomRadius)
    custom_radius;
}


class Height{

    @IsNotEmpty()
    @IsNumber()
    min

    @IsNotEmpty()
    @IsNumber()
    max

    @IsNotEmpty()
    @IsEnum(ModelHeightEnum)
    unit: String;
}

class Weight{

    @IsNotEmpty()
    @IsNumber()
    min

    @IsNotEmpty()
    @IsNumber()
    max

    @IsNotEmpty()
    @IsEnum(ModelWeightEnum)
    unit: String;
}


class Color {
    @IsOptional()
    @IsArray()
    hair_color;

    @IsOptional()
    @IsArray()
    eye_color;


    @IsOptional()
    @IsArray()
    skin_color;
}



class SizeType{
    @IsNotEmpty()
    @IsEnum(ModelBodySizeEnum)
    unit: String;

    @IsNotEmpty()
    @IsNumber()
    value;

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

class Rating{
    @IsNotEmpty()
    @IsEnum(OrderByEnum)
    order


    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    categoryId

}


class SortBy{
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => NearBy)
    near_by;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Rating)
    rating;
}


class Pagination {
    @IsNotEmpty()
    @IsNumber()
    page;

    @IsNotEmpty()
    @IsNumber()
    per_page;

}


export class FilterDto {
    @IsOptional()
    @IsString()
    user_type: string;

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    user_id: string;


    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    model_id: string;


    @IsOptional()
    @IsString()
    search_query: string;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Filter)
    filters;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SearchArea)
    search_area;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SortBy)
    sort_by;


    @IsOptional()
    @IsArray()
    gender;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Height)
    height;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Weight)
    weight;


    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Color)
    color;


    @IsOptional()
    @IsString()
    race;


    @IsOptional()
    @IsString()
    birth_date;


    @IsOptional()
    @IsString()
    fashion_work;


    @IsOptional()
    @IsBoolean()
    is_advance_filter_fee_paid;



    @IsOptional()
    @IsBoolean()
    search_by_user;



    @IsOptional()
    @IsArray()
    languages_spoken;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Size)
    size: Size;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => PastExperience)
    past_experience;


    @IsOptional()
    @IsNumber()
    limit;

    @IsNotEmpty()
    @IsEnum(FilterSearchType)
    type;

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Pagination)
    pagination;


}

