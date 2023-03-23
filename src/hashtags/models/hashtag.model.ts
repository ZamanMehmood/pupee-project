import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from "mongoose";

export type HashtagDocument = Hashtag & Document;

@Schema()
export class Hashtag {

    @Prop({type: Number, default:0})
    count;

    @Prop({type: [mongoose.Schema.Types.ObjectId],ref:"posts", default: []})
    posts;


    @Prop({type: String, default:""})
    title;


}

export const HashtagSchema = SchemaFactory.createForClass(Hashtag);
