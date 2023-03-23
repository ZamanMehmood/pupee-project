import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AffliateLinksDocument = AffliateLinks & Document;

@Schema()
export class AffliateLinks {
  @Prop({ type: String, default: '' })
  name;

  @Prop({ type: String, default: '' })
  image;

  @Prop({ type: String, default: '' })
  website_link;
}

export const AffliateLinksSchema = SchemaFactory.createForClass(AffliateLinks);
