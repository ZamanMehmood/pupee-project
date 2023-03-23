import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Block, Role} from "../../enums/user.enum";
import * as mongoose from "mongoose";

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    userId;

    @Prop({ type: String, default: '' })
    text;


    @Prop({ type: String, default: '' })
    reply;

    @Prop({type: Date, default: Date.now})
    timestamp;

}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
