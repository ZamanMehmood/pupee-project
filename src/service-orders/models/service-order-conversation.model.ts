import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ServiceOrderConversationDocument = ServiceOrderConversation &
  Document;

@Schema()
export class ServiceOrderConversation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'serviceorders' })
  service_order_id;

  @Prop({
    type: [
      {
        message_text: { type: String, default: '' },
        sender: { type: mongoose.Schema.Types.ObjectId },
        receiver: { type: mongoose.Schema.Types.ObjectId },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  messages;

  @Prop({ type: Date, default: Date.now })
  timestamp;
}

export const ServiceOrderConversationSchema = SchemaFactory.createForClass(
  ServiceOrderConversation,
);
