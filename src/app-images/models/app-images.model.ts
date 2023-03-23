import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppImageDocument = AppImage & Document;

@Schema()
export class AppImage {
  @Prop({ type: String })
  image_url;
}

export const AppImageSchema = SchemaFactory.createForClass(AppImage);
