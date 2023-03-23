import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

export type WithdrawMethodDocument = WithdrawMethod & Document;

@Schema()
export class WithdrawMethod {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'users', default: null })
  user_id;

  @Prop({ type: String })
  bank_name;

  @Prop({ type: String })
  account_number;

  @Prop({ type: Boolean, default: false })
  is_default_method;
}

export const WithdrawMethodSchema =
  SchemaFactory.createForClass(WithdrawMethod);
