import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from "mongoose";

export type ModelRatingCategoryDocument = ModelRatingCategory & Document;

@Schema()
export class ModelRatingCategory {

    @Prop({type: String,default:''})
    query;


    @Prop({type: String,default:''})
    title;


}

export const ModelRatingCategorySchema = SchemaFactory.createForClass(ModelRatingCategory);
