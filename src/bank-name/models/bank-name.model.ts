import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankNameDocument = BankName & Document;

@Schema()
export class BankName {
  @Prop({ type: String })
  name;
}

export const BankNameSchema = SchemaFactory.createForClass(BankName);
