import {Exclude, Expose, Transform, Type} from 'class-transformer';
import {IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested} from "class-validator";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"
import {DeleteUserType} from '../../enums/user.enum';

export class UserDto {
  @Expose()
  email: string;

  @Expose()
  user_type: string;

  @Exclude()
  password: string;
}




export class DeleteUser {
    @IsString()
    @IsEnum(DeleteUserType)
    type;

    @IsBoolean()
    @IsOptional()
    cover_image;

    @IsBoolean()
    @IsOptional()
    profile_image_url;

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    id: String;


    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    assetId: String;

}

export class DeleteUserImageDto {
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => DeleteUser)
    list;
}




export class FeedbackDto {

    @IsString()
    @IsOptional()
    reply;

    @IsString()
    @IsNotEmpty()
    text;

}