import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {Provider, UserTypesEnum} from "../../enums/user.enum";
import {ModelBodySizeEnum, ModelHeightEnum, ModelWeightEnum, YesNoEnum} from "../../enums/modeling.enum";

export type ModelingStatsDocument = ModelingStats & Document;



@Schema()
export class ModelingStats {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'models' })
    modelId;


    @Prop({
        type: [{
            createdAt:{type: Date,default:Date.now()},
        }],
        default: [],
    })
    profile;

    @Prop({
        type: [{
            createdAt:{type: Date,default:Date.now()},
        }],
        default: [],
    })
    portfolio;

    @Prop({
        type: [{
            createdAt:{type: Date,default:Date.now()},
        }],
        default: [],
    })
    basic;

    @Prop({
        type: [{
            createdAt:{type: Date,default:Date.now()},
        }],
        default: [],
    })
    advance;

    @Prop({
        type: [{
            asset:{type:String,default:""},
            createdAt:{type: Date,default:Date.now()},
        }],
        default: [],
    })
    photos;

}

export const ModelingStatsSchema =
    SchemaFactory.createForClass(ModelingStats);
