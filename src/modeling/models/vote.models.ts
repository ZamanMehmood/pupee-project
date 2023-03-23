import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from "mongoose";

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {

    @Prop({
        type: [{
            date:{type: String,default:false},
            userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }
        }],
        default: [],
    })
    list;


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'models' })
    modelId;


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    userId;



    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'rating-category' })
    categoryId;

}

export const VoteSchema = SchemaFactory.createForClass(Vote);
