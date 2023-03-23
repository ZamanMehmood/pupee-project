import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {Provider, UserTypesEnum} from "../../enums/user.enum";
import {
    ChatMessageType,
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelWeightEnum,
    YesNoEnum
} from "../../enums/modeling.enum";

export type ModelChatDocument = ModelChat & Document;



@Schema({timestamps: true})
export class ModelChat {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    senderId;



    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    receiverId;

    @Prop({
        type: {
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
        },
        default: {},
    })
    senderInfo;



    @Prop({
        type: {
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
        },
        default: {},
    })
    receiverInfo;


    @Prop({type: String})
    message;


    @Prop({type: String, enum: ChatMessageType, default: ChatMessageType.MESSAGE})
    type;


}

export const ModelChatSchema =
    SchemaFactory.createForClass(ModelChat);
