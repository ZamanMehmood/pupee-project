import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AffliateLinkSitesDocument = AffliateLinkSites & Document;

@Schema()
export class AffliateLinkSites {
  @Prop({ type: String, default: '' })
  title;

  @Prop({ type: String, default: '' })
  logo;

  @Prop({ type: String, default: '' })
  url;
}

export const AffliateLinkSitesSchema =
  SchemaFactory.createForClass(AffliateLinkSites);
