import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Block} from "../../enums/user.enum";

export type ServiceOrdersDocument = ServiceOrders & Document;

export enum STATUS {
    accepted = 'accepted',
    requestPending = 'requestPending',
    inProgress = 'inProgress',
    scheduled = 'scheduled',
    started = 'started',
    delivered = 'delivered',
    revisionRequested = 'revisionRequested',
    completed = 'completed',
}


class Status  {

    @Prop({ default: new Date() }) //set as default
    createdAt: string;

    @Prop({ type:String,required: true })
    type;

    @Prop({ type:mongoose.Schema.Types.Array,required: false })
    asset:String[];

    @Prop({ type:String,required: false })
    description;

    @Prop({type: Date, default: Date.now})
    timestamp;
}


@Schema()
export class ServiceOrders {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    user_id;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    service_provider_id;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'services'})
    service_id;

    @Prop({type: String, default: ''})
    instant_or_schedule_service;

    @Prop({type: String, default: ''})
    title;

    @Prop({type: String, default: ''})
    cover_image;

    @Prop({type: String, default: ''})
    date;

    @Prop({type: String, default: ''})
    stripe_token;

    @Prop({type: Number, default: 0})
    service_price;

    @Prop({type: String, default: ''})
    time_slot;

    @Prop({type: String, default: ''})
    description;

    @Prop({type: Number, default: 0})
    total_price;

    @Prop({type: [], default: []})
    reviews;

    @Prop({type: Number, default: 0})
    total_reviews;

    @Prop({type: Number, default: 0})
    rating;

    @Prop({type: String, default: ''})
    address;

    @Prop({type: Number, default: 0})
    service_charges;

    @Prop({type: Number, default: 0})
    discount;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'userpaymentcards'})
    payment_method;

    @Prop({type: String, default: ''})
    status;

    @Prop({type: Boolean ,default: false})
    customer_reviewed;

    @Prop({type: String, default: ''})
    occupation;


    @Prop({type: String, enum: Block, default: Block.UNBLOCKED})
    blocked;


    @Prop({ type: mongoose.Schema.Types.Array})
    history: Status[]

    @Prop({type: Date})
    deadline_date;

    @Prop({type: Date})
    decline_date;


    @Prop({type: Date, default: Date.now})
    timestamp;
}

export const ServiceOrdersSchema = SchemaFactory.createForClass(ServiceOrders);
