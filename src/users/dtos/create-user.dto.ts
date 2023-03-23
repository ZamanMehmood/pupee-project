import {IsEmail, IsEnum, IsNotEmpty, IsString} from 'class-validator';
import {UserTypesEnum} from '../../enums/user.enum';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;


    @IsString()
    user_name: string;


    @IsEnum(UserTypesEnum)
    user_type: string;


}

export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    current_password: string;

    @IsString()
    @IsNotEmpty()
    new_password: string;
}

export class EmailExistDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class EmailVerifyDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}
