import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

export type ReviewServiceDocument = ReviewService & Document;

@Schema()
export class ReviewService {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'services' })
  service_id;
  @Prop({ type: MSchema.Types.ObjectId, ref: 'users' })
  user_id;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'serviceorders' })
  order_id;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'users' })
  service_provider_id;

  @Prop({ type: String, default: '' })
  review;

  @Prop({ type: Number, default: 0 })
  communication;

  @Prop({ type: Number, default: 0 })
  service_as_described;

  @Prop({ type: Number, default: 0 })
  would_recomment;

  @Prop({ type: Number, default: 0 })
  rating;
}

export const ReviewServiceSchema = SchemaFactory.createForClass(ReviewService);
