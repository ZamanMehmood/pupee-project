import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ReviewsDocument = Reviews & Document;

@Schema()
export class Reviews {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'posts', default: null })
  post_id;

  @Prop({ type: String, default: '' })
  product_name;

  @Prop({ type: Number, default: 0 })
  number_of_likes;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    default: [],
  })
  who_likes;

  @Prop({ type: Number, default: 0 })
  number_of_disLikes;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    default: [],
  })
  who_dislikes;
}

export const ReviewsSchema = SchemaFactory.createForClass(Reviews);