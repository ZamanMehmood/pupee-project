import {
    isArray,
    IsArray,
    IsBoolean, IsDate,
    IsNotEmpty, IsNumber,
    IsObject,
    IsOptional,
    IsString, ValidateNested,
} from 'class-validator';
import {Type} from "class-transformer";


class Member {

    @IsNotEmpty()
    @IsString()
    userId;

    @IsNotEmpty()
    @IsString()
    first_name;

    @IsNotEmpty()
    @IsString()
    last_name;

    @IsNotEmpty()
    @IsString()
    user_name;


    @IsNotEmpty()
    @IsString()
    profile_image_url;

}


class Radius {

    @IsNotEmpty()
    @IsNumber()
    lat;

    @IsNotEmpty()
    @IsNumber()
    lng;

    @IsNotEmpty()
    @IsString()
    address;

    @IsNotEmpty()
    @IsNumber()
    miles;

}


class Others {

    @IsOptional()
    @IsBoolean()
    local

    @IsOptional()
    @IsBoolean()
    cities_countries;

    @IsOptional()
    @IsBoolean()
    global: string;

    @ValidateNested()
    @Type(() => Radius)
    radius;

}


class MyList {

    @IsNotEmpty()
    @IsBoolean()
    selected;

    @IsNotEmpty()
    @IsString()
    type;


    @IsNotEmpty()
    @IsNumber()
    members;

}



export class CreatePrivacyPolicyDto {

    @IsArray()
    @ValidateNested()
    @Type(() => Member)
    hide_members_from;


    @IsArray()
    @ValidateNested()
    @Type(() => MyList)
    my_list;



    @ValidateNested()
    @Type(() => Others)
    other;

}

