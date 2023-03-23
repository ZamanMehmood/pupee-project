import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {SenderReportProblem, UserTypesEnum} from '../../enums/user.enum';
import {Transform, Type} from "class-transformer";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"

export class CreateReportProblem {
    @IsOptional()
    @IsString()
    topic;


    @IsEnum(SenderReportProblem)
    @IsString()
    sender;



    @IsNotEmpty()
    @IsString()
    description;

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    userId;


}
