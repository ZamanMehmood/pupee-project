import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CommentsDocument = Comments & Document;

@Schema()
export class Comments {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'posts' })
  postId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId;

  @Prop({ type: String, default: '' })
  comment_text;

  @Prop({ type: [{ userId: mongoose.Schema.Types.ObjectId }], ref: 'users' })
  who_likes;

  @Prop({ type: Number, default: 0 })
  number_of_likes;

  @Prop({ type: Number, default: 0 })
  number_of_sub_comments;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'subcomments' })
  sub_comments;

  @Prop({ type: Date, default: Date.now })
  timestamp;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
