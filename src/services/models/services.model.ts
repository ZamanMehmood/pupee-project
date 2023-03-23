import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Block} from "../../enums/user.enum";

export type ServicesDocument = Services & Document;

@Schema()
export class Services {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null})
    user_id;

    @Prop({type: String, default: ''})
    photo;

    @Prop({type: String, default: ''})
    you_offering;

    @Prop({type: String, default: ''})
    service_description;

    @Prop({type: String, default: ''})
    average_rating;

    @Prop({type: String, default: ''})
    reviews_count;

    @Prop({type: String, default: ''})
    location;

    @Prop({type: String, default: ''})
    instant_or_schedule_service;

    @Prop({
        type: [
            {
                package_name: {type: String, default: ''},
                package_price: {type: Number, default: 0},
                package_includes: {
                    type: [
                        {
                            text: {type: String, default: ''},
                            is_included: {type: Boolean, default: false},
                        },
                    ],
                    default: [],
                },
            },
        ],
        default: [],
    })
    packages;

    @Prop({type: Boolean, default: false})
    traver_for_service;

    @Prop({type: Number, default: 0})
    base_price;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'ratings', default: null})
    rating_id;


    @Prop({type: String, enum: Block, default: Block.UNBLOCKED})
    blocked;

    @Prop({type: String, default: ''})
    occupation;


    @Prop({
        type: [
            {
                title: {type: String, default: ''},
                description: {type: String, default: ''},
                price: {type: Number, default: 0},
                payment_should: {type: String, default: ''},
            },
        ],
        default: [],
    })
    add_on;
}

export const ServicesSchema = SchemaFactory.createForClass(Services);
