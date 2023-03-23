import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SearchHistoryDocument = SearchHistory & Document;

@Schema()
export class SearchHistory {
  @Prop({ type: String })
  name;
}

export const SearchHistorySchema = SchemaFactory.createForClass(SearchHistory);
