import { Expose, Type} from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";



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


class Exclude {

    @IsOptional()
    @IsArray()
    service_providers;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CitiesCountries)
    cities_countries;


}


export class FilterDto {
    @IsOptional()
    @IsString()
    user_type: string;


    @IsOptional()
    @IsString()
    sort_by: string;


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
    @Type(() => Exclude)
    exclude;

}

