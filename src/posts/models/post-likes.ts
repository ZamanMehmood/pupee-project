import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PostLikesDocument = PostLikes & Document;

@Schema()
export class PostLikes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'post' })
  post_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user_id;

  @Prop({ type: Date, default: Date.now })
  timestamp;
}

export const PostLikesSchema = SchemaFactory.createForClass(PostLikes);
