import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CustomReviewsDocument = CustomReviews & Document;

@Schema()
export class CustomReviews {
  @Prop({ type: String, ref: 'customreviews' })
  name;

  @Prop({ type: Date, default: Date.now })
  timestamp;
}

export const CustomReviewsSchema = SchemaFactory.createForClass(CustomReviews);
