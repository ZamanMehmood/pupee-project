import {
    ArrayMinSize,
    IsArray,
    IsDate, IsEnum,
    IsNotEmpty,
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
import {WeddingMediumTypeEnum} from "../../enums/wedding.enum";



class TemplateVariables {

    @IsNotEmpty()
    key: String;

    @IsOptional()
    value: String;
}


class Relation {

    @IsNotEmpty()
    @IsString()
    label: String;

    @IsNotEmpty()
    @IsString()
    value: String;
}


class Template {
    @IsNotEmpty()
    description;

    @IsOptional()
    @IsArray()
    assets: String[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TemplateVariables)
    variables: TemplateVariables;

    @IsNotEmpty()
    default:Boolean;


    @IsOptional()
    @IsArray()
    location: String[];

    @IsOptional()
    special_instructions: String;

    @IsOptional()
    theme:String;

}


class Recipient {
    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Relation)
    relation: Relation;

    @IsNotEmpty()
    first_name: String;

    @IsNotEmpty()
    last_name: String;

    @IsOptional()
    phone_number: String;

    @IsNotEmpty()
    email: String;
}


export class AddWeddingAnnouncementDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingId: String;


    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Template)
    template: Template;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Recipient)
    recipient: Recipient;

    @IsNotEmpty()
    @IsEnum(WeddingMediumTypeEnum)
    type

}


export class UpdateWeddingAnnouncementDto {

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    weddingAnnouncementId: String;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Template)
    template: Template;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Recipient)
    recipient: Recipient;

}



export class AddWeddingTemplateDto {


    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Template)
    template: Template;

}


export class UpdateWeddingTemplateDto {


    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Template)
    template: Template;
}