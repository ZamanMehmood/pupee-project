import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as TypeSchema } from 'mongoose';

export type AdvertiseServiceDocument = AdvertiseService & Document;

export const SelectedAudienceType = {
  local: { type: Boolean, default: false },
  cities_countries: {
    type: {
      cities: { type: [String], default: [] },
      countries: { type: [String], default: [] },
    },
  },
  global: { type: Boolean, default: true },
  custom_radius: {
    type: {
      latitude: { type: String, default: '' },
      longitude: { type: String, default: '' },
      address: { type: String, default: '' },
      radius: { type: String, default: '' },
    },
  },
  hide_from: {
    type: {
      hide_from_users: {
        type: [TypeSchema.Types.ObjectId],
        ref: 'users',
        default: [],
      },
      cities_countries: {
        type: {
          cities: { type: [String], default: [] },
          countries: { type: [String], default: [] },
        },
      },
    },
  },
};

@Schema()
export class AdvertiseService {
  @Prop({ type: TypeSchema.Types.ObjectId, ref: 'users' })
  user_id;

  @Prop({ type: TypeSchema.Types.ObjectId, ref: 'services' })
  service_id;

  @Prop({ type: String, default: '' })
  service_name;

  @Prop({ type: String, default: '' })
  goal;

  @Prop({ type: String, default: '' })
  Stripe_token;

  @Prop({ type: Number, default: 0 })
  age_min;

  @Prop({ type: Number, default: 0 })
  age_max;

  @Prop({ type: String, default: '' })
  gender;

  @Prop({ type: [String], default: [] })
  occupations;

  @Prop({ type: [String], default: [] })
  interests;

  @Prop({ type: [String], default: [] })
  keywords;

  @Prop({ type: [String], default: [] })
  search_history;

  @Prop({ type: SelectedAudienceType })
  selected_audience;

  @Prop({ type: String, default: '' })
  business_category;

  @Prop({ type: String, default: '' })
  start_date;

  @Prop({ type: String, default: '' })
  total_budget;

  @Prop({ type: Number, default: 0 })
  duration;
}

export const AdvertiseServiceSchema =
  SchemaFactory.createForClass(AdvertiseService);
