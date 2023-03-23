import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {UserTypesEnum} from "../../enums/user.enum";
import {WeddingServicesType} from "../../enums/wedding.enum";

export type WeddingRegistryDocument = WeddingRegistry & Document;

@Schema()
export class WeddingRegistry {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;

    @Prop({type: String,default:""})
    name;

    @Prop({type: String,default:""})
    description;

    @Prop({type: String,default:""})
    link;

}

export const WeddingRegistrySchema =
    SchemaFactory.createForClass(WeddingRegistry);
