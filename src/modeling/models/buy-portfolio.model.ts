import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {Provider, UserTypesEnum} from "../../enums/user.enum";
import {
    AssetType,
    BuyPortfolioType,
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelWeightEnum,
    YesNoEnum
} from "../../enums/modeling.enum";

export type BuyPortfolioDocument = BuyPortfolio & Document;



@Schema()
export class BuyPortfolio {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'models' })
    modelId;


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'models' })
    portfolioId;

    @Prop({ type: String,default:"" })
    asset;

    @Prop({type: Number, default: 0})
    price;



    @Prop({type: String,enum: BuyPortfolioType, default: BuyPortfolioType.SINGLE_USE})
    license_type;


    @Prop({type: String,enum: AssetType, default: AssetType.IMAGE})
    type;

    @Prop({type: String,default:""})
    country;


    @Prop({type: Date, default: Date.now})
    date_created;


}

export const BuyPortfolioSchema =
    SchemaFactory.createForClass(BuyPortfolio);
