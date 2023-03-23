import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {UserTypesEnum} from "../../enums/user.enum";
import {WeddingServicesType} from "../../enums/wedding.enum";

export type WeddingServicesDocument = WeddingServices & Document;

@Schema()
export class WeddingServices {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;

    @Prop({type: String,default:""})
    title;

    @Prop({type: String,default:""})
    logo;

    @Prop([{type: String,default:[]}])
    tags;

    @Prop({type: Number,default:0})
    rating;

    @Prop({type: Number,default:0})
    comments_count;

    @Prop({type: Date, default: Date.now})
    date_created;

    @Prop({type: String,default:""})
    address;

    @Prop({type: String,default:""})
    video;

    @Prop([{type: String,default:[]}])
    past_work;

    @Prop({type: String, enum: WeddingServicesType, default: WeddingServicesType.RECEPTION})
    type;



}

export const WeddingServicesSchema =
    SchemaFactory.createForClass(WeddingServices);
