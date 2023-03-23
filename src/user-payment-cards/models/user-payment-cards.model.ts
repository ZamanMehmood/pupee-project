import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserPaymentCardsDocument = UserPaymentCards & Document;

@Schema()
export class UserPaymentCards {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null })
  user_id;

  @Prop({ type: String, default: '' })
  card_holder_name;

  @Prop({ type: String, default: '' })
  card_number;

  @Prop({ type: String, default: '' })
  expiry;

  @Prop({ type: String, default: '' })
  cvv;
}

export const UserPaymentCardsSchema =
  SchemaFactory.createForClass(UserPaymentCards);
