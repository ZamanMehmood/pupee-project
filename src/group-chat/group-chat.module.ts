import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {GroupChatSchema} from './models/group-chat';
import {GroupConversationSchema} from "./models/group-conversation";
import {GroupChatService} from "./group-chat.service";
import {GroupChatController} from "./group-chat.controller";
import {WeddingSchema} from "../wedding/models/wedding.model";
import {ContactSchema} from "../users/models/contacts.model";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ChatService} from "../modeling/chat.service";
import {UserSchema} from "../users/models/users.model";
import {ModelingSchema} from "../modeling/models/modeling.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'groups', schema: GroupChatSchema },
            {name: 'groupconversations', schema: GroupConversationSchema},
            {name: 'wedding', schema: WeddingSchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'users', schema: UserSchema},
            {name: 'models', schema: ModelingSchema},

        ]),
    ],
    providers: [GroupChatService,ModelingGateway,ChatService],
    controllers: [GroupChatController],
})
export class GroupChatModule {}
