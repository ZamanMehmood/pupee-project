import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Products & Document;

@Schema()
export class Products {
  @Prop({ type: String })
  name;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
