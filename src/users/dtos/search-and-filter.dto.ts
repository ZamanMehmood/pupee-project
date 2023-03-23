import { Expose, Type} from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";



class Search {

    @IsNotEmpty()
    @IsString()
    field;

    @IsArray()
    @ArrayMinSize(1)
    value;

}




export class SearchAndFilterDto {
    @IsObject()
    @ValidateNested()
    @Type(() => Search)
    search;



}

