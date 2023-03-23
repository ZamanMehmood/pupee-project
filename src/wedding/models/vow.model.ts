import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";

export type VowDocument = Vow & Document;

@Schema()
export class Vow {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;


    @Prop({
        type: [{
            description: {type: String, default: ''},
            default: {type: Boolean, default: false},
        }],
        default: [],
    })
    detail;
}

export const VowSchema = SchemaFactory.createForClass(Vow);
