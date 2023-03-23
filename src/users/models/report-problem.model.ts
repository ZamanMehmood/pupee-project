import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import {Block, SenderReportProblem} from "../../enums/user.enum";

export type ReportProblemDocument = ReportProblemModel & Document;

@Schema()
export class ReportProblemModel {
    @Prop({type: String, default: ''})
    topic;

    @Prop({type: String, enum: SenderReportProblem, default: SenderReportProblem.USER})
    sender;


    @Prop({type: String, default: ''})
    description;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    userId;

    @Prop({ type: Date, default:Date.now })
    date_created;
}

export const ReportProblemSchema = SchemaFactory.createForClass(ReportProblemModel);
