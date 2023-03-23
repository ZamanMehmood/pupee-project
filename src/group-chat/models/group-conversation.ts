import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import {GroupChats} from "./group-chat";


export type GroupChatConversationDocument = GroupConversations & Document;

@Schema({timestamps: true})
export class GroupConversations {

    @Prop({
        type: {
            text: {type: String, default: ''},
            msg_type: {type: String, default: ''},
            asset: {type: String, default: ''},
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
            senderInfo:{
                type: {
                    first_name: {type: String, default: ''},
                    last_name: {type: String, default: ''},
                    profile_image_url: {type: String, default: ''},
                },
                default:{}
            },
            timestamp: {type: Date, set: d => new Date(d * 1000)},
        },
        default: {},
    })
    message;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'group'})
    groupId;


}

export const GroupConversationSchema = SchemaFactory.createForClass(
    GroupConversations,
);
