import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema()
export class Goal {
  @Prop({ type: String })
  name;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
