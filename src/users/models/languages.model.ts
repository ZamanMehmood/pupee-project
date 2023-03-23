import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LanguageDocument = Languages & Document;

@Schema()
export class Languages {
  @Prop({ type: String, default: '' })
  name;
}

export const LanguagesSchema = SchemaFactory.createForClass(Languages);
