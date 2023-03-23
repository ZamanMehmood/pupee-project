import {Exclude, Expose, Type} from 'class-transformer';
import {IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested} from "class-validator";

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



class MyList {

    @IsNotEmpty()
    @IsString()
    type;

    @IsArray()
    @ValidateNested()
    @Type(() => Member)
    members;

}



export class CreateMyListDto {

    @IsObject()
    @ValidateNested()
    @Type(() => MyList)
    my_list;

}
