import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";

export type BudgetPlannerDocument = BudgetPlanner & Document;

@Schema()
export class BudgetPlanner {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;


    @Prop({ type: Number, default: 0 })
    total;


    @Prop({
        type: [{
            title: {type: String, default: ''},
            amount: {type: Number, default: 0},
            confirmed: {type: Boolean, default: false},
        }],
        default: [],
    })
    budget;
}

export const  BudgetPlannerSchema = SchemaFactory.createForClass(BudgetPlanner);
