import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Block, InvitationMedium, InvitationType, Role} from "../../enums/user.enum";
import * as mongoose from "mongoose";

export type InvitationDocument = Invitation & Document;

@Schema()
export class Invitation {
    @Prop({ type: String, default: '' })
    key;

    @Prop({ type: String, enum: InvitationType, default: InvitationType.WEDDING })
    type;


    @Prop({ type: String, enum: InvitationMedium, default: InvitationMedium.EMAIL })
    medium;


    @Prop({
        type: {
            id: {type: mongoose.Schema.Types.ObjectId},
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
            timestamp: {type: Date, default: Date.now},
        },
        default: {},
    })
    userInfo;

    @Prop({type: Date, default: Date.now})
    timestamp;

}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
