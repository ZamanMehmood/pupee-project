import { Expose, Type} from 'class-transformer';
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
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelStatsEnum,
    ModelWeightEnum,
    OrderByEnum,
    YesNoEnum
} from "../../enums/modeling.enum";




export class AddStatsDto {
    @IsOptional()
    @IsEnum(ModelStatsEnum)
    stats;

    @IsOptional()
    @IsString()
    asset;
}

