import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {StaticDataEnum} from "../../enums/user.enum";

export type StaticDataDocument = StaticData & Document;

@Schema()
export class StaticData {
    @Prop({type: String, enum: StaticDataEnum, default: StaticDataEnum.TERMS_CONDITIONS})
    type;

    @Prop({type: String, default: ''})
    data;


}

export const StaticDataSchema = SchemaFactory.createForClass(StaticData);
