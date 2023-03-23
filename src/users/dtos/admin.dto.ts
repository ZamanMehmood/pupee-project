import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Role} from "../../enums/user.enum";
import {Transform, Type} from "class-transformer";
import {validateMongoId} from "../../utils/mongo";
import { Types } from "mongoose"

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    username;

    @IsString()
    @IsNotEmpty()
    password;


    @IsNotEmpty()
    @IsEnum(Role)
    role;

}

export class UpdateAdminDto {

    @IsString()
    @IsOptional()
    username;



    @IsOptional()
    @IsEnum(Role)
    role;
}



export class UpdateAdminPasswordDto {
    @IsString()
    @IsNotEmpty()
    old_password;


    @IsString()
    @IsNotEmpty()
    new_password;

}


export class ValidateAdminDto {
    @IsString()
    @IsNotEmpty()
    username;

    @IsString()
    @IsNotEmpty()
    password;
}