import {ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested} from 'class-validator';
import * as mongoose from "mongoose";
import {Type,Transform } from "class-transformer";
import { Types } from "mongoose"
import {BadRequestException} from "@nestjs/common";
import {validateMongoId} from "../../utils/mongo";


class ProfileInfo {



    @IsNotEmpty()
    first_name: String;


    @IsNotEmpty()
    last_name: String;


    @IsNotEmpty()
    @IsString()
    profile_image_url: string;

}


class GroupUser {


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


class GroupMessage {

    @IsNotEmpty()
    text: String;




    @IsNotEmpty()
    msg_type: String;

    @IsOptional()
    asset: String;

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    sender: String;

    @IsNotEmpty()
    @ValidateNested({each: true})
    @Type(() => ProfileInfo)
    senderInfo;

}


export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    logo: string;


    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;


    @IsArray()
    @ValidateNested({each: true})
    @Type(() => GroupUser)
    @ArrayMinSize(1)
    users: GroupUser [];
}



export class UpdateGroupDto {
    @IsOptional()
    name: string;

    @IsOptional()
    logo: string;
}


export class AddGroupMembersDto {

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => GroupUser)
    @ArrayMinSize(1)
    users: GroupUser [];
}


export class DeleteGroupMemberDto {
    @IsArray()
    @ArrayMinSize(1)
    users: String [];
}


export class CreateGroupMessageDto {
    @ValidateNested()
    @Type(() => GroupMessage)
    message;

    @IsOptional()
    groupId: string;

}