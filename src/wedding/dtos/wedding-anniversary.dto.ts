import {
    ArrayMinSize,
    IsArray, IsBoolean,
    IsDate, IsEnum,
    IsNotEmpty, IsNumber,
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
import {WeddingServicesType} from "../../enums/wedding.enum";


class Wheel {


    @IsNotEmpty()
    @IsString()
    label;

    @IsNotEmpty()
    @IsBoolean()
    value;

}

class When {


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Wheel)
    1;

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Wheel)
    2;


    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Wheel)
    3;


}


class Who {


    @IsNotEmpty()
    @IsBoolean()
    me;

    @IsNotEmpty()
    @IsBoolean()
    my_wife_husband;


}

export class Anniversary {


    @IsObject()
    @ValidateNested({each: true})
    @Type(() => When)
    when: When;


    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Who)
    who: Who;


}


export class WeddingAnniversaryDto {

    @IsObject()
    @ValidateNested({each: true})
    @Type(() => Anniversary)
    wedding_anniversary: Anniversary;
}
