import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {UserTypesEnum} from "../../enums/user.enum";
import {WeddingServicesType} from "../../enums/wedding.enum";

export type OrderOfProceedingDocument = OrderOfProceeding & Document;

@Schema()
export class OrderOfProceeding {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;


    @Prop({
        type: [{
            date: {type: Date,default: Date.now},
            start_time: {type: String, default: ''},
            end_time: {type: String, default: ''},
            title: {type: String, default: ''},
            description: {type: String, default: ''},
            all_day: {type: Boolean, default: false},

        }],
        default: [],
    })
    event;



    @Prop({
        type: [{
            userId: {type: mongoose.Schema.Types.ObjectId},
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
            can_edit:{type: Boolean, default: false},
            timestamp: {type: Date, default: Date.now},
        }],
        default: [],
    })
    shared_with;
}

export const OrderOfProceedingSchema =
    SchemaFactory.createForClass(OrderOfProceeding);
