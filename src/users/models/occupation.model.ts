import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OccupationDocument = Occupations & Document;

@Schema()
export class Occupations {
  @Prop({ type: String, default: '' })
  name;
}

export const OccupationsSchema = SchemaFactory.createForClass(Occupations);
