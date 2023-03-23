import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RatingDocument = RatingModel & Document;

export const RatingType = {
    user_info: {
        userId: {
            type: String,
        },
        first_name: {
            type: String
        },
        last_name: {
            type: String
        },
        user_name: {
            type: String
        },
        profile_image_url: {
            type: String
        }
    },
    review: String,
    date_created:{type: Date, default: Date.now},
    service_id:{type: mongoose.Schema.Types.ObjectId, ref: 'services', default: null},
    order_id:{type: mongoose.Schema.Types.ObjectId, ref: 'serviceorders', default: null},
    communication:{type: Number, default: -1},
    service_as_described:{type: Number, default: -1},
    would_recommend:{type: Number, default: -1},


};

@Schema()
export class RatingModel {


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null})
    user_id;


    @Prop({
        type: {
            0: [RatingType],
            1:[RatingType],
            2:[RatingType],
            3:[RatingType],
            4:[RatingType],
            5:[RatingType],

        },
        default: {
            0: [],
            1:[],
            2:[],
            3:[],
            4:[],
            5:[],
        },
    })
    rating;


}

export const RatingSchema =
    SchemaFactory.createForClass(RatingModel);
