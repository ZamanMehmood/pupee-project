import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeywordDocument = Keyword & Document;

@Schema()
export class Keyword {
  @Prop({ type: String })
  name;
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);