import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Block, Role} from "../../enums/user.enum";

export type StorageDocument = Storage & Document;

@Schema()
export class Storage {
    @Prop({ type: Number, default: 0 })
    price_per_month;

    @Prop({ type: Number, default: 0 })
    price_per_year;

    @Prop({ type: Number, default: 0 })
    storage;


    @Prop({ type: Number, default: 0 })
    service_charges;

    @Prop({ type: Number, default: 0 })
    discount;

    @Prop({ type: String, default: '' })
    title;


    @Prop({type: Date, default: Date.now})
    timestamp;

}

export const StorageSchema = SchemaFactory.createForClass(Storage);
