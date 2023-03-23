import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InterestDocument = Interests & Document;

@Schema()
export class Interests {
  @Prop({ type: String, default: '' })
  name;
}

export const InterestsSchema = SchemaFactory.createForClass(Interests);
