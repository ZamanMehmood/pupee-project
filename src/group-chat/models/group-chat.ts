import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import {ServiceOrders} from "../../service-orders/models/service-orders.model";


export type GroupChatDocument = GroupChats & Document;


@Schema({ timestamps: true })
export class GroupChats {


    @Prop({
        type: [{
            id: { type: mongoose.Schema.Types.ObjectId },
            first_name: { type: String,default:'' },
            last_name: { type: String,default:'' },
            profile_image_url: { type: String,default:'' },
            timestamp: { type: Date, set: d => new Date(d * 1000) },
        }],
        default: [],
    })
    users;

    @Prop({ type: String })
    name;

    @Prop({ type: String })
    logo;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;

}

export const GroupChatSchema = SchemaFactory.createForClass(
    GroupChats,

);
