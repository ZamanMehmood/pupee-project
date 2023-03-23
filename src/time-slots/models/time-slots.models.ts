import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TimeSlotsDocument = TimeSlots & Document;

@Schema()
export class TimeSlots {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'services' })
  service_id;

  @Prop({ type: String, default: '' })
  time_slot;

  @Prop({ type: Date, default: Date.now })
  timestamp;
}

export const TimeSlotsSchema = SchemaFactory.createForClass(TimeSlots);
