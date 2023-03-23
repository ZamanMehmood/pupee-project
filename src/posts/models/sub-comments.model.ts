import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SubCommentsDocument = SubComments & Document;

@Schema()
export class SubComments {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'comments' })
  comment_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user_id;

  @Prop({ type: String, default: '' })
  comment_text;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'users' })
  who_likes;

  @Prop({ type: Number, default: 0 })
  number_of_likes;

  @Prop({ type: Date, default: Date.now })
  timestamp;
}

export const SubCommentsSchema = SchemaFactory.createForClass(SubComments);
