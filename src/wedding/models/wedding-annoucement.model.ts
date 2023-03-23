import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {UserTypesEnum} from "../../enums/user.enum";
import {WeddingMediumTypeEnum} from "../../enums/wedding.enum";

export type WeddingAnnouncementDocument = WeddingAnnouncement & Document;

@Schema()
export class WeddingAnnouncement {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'weddings' })
    weddingId;


    @Prop({
        type: [{
            theme:{type:String,default:''},
            description: {type: String, default: ''},
            assets: {type: [String], default: ''},
            default: {type: Boolean, default: false},
            location: {type: [String], default: ''},
            special_instructions: {type: String, default: ''},
            variables:[{
                key: {type: String, default: ''},
                value: {type: String, default: ''},
            }]
        }],
        default: [],
    })
    template;


    @Prop({
        type: [{
            relation: {
                label: {type: String, default: ''},
                value: {type: String, default: ''},
            },
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            phone_number: {type: String, default: ''},
            email: {type: String, default: ''},
        }],
        default: [],
    })
    recipient;


    @Prop({type: String, enum: WeddingMediumTypeEnum, default: WeddingMediumTypeEnum.ANNOUNCEMENT})
    type;




    @Prop({type: Date, default: Date.now})
    date;

}

export const WeddingAnnouncementSchema =
    SchemaFactory.createForClass(WeddingAnnouncement);
