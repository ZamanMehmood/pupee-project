import { Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {MongooseModule} from '@nestjs/mongoose';
import {WeddingSchema} from './models/wedding.model';
import {WeddingService} from "./wedding.service";
import {GroupChatService} from "../group-chat/group-chat.service";
import {WeddingController} from "./wedding.controller";
import {GroupChatSchema} from "../group-chat/models/group-chat";
import {GroupConversationSchema} from "../group-chat/models/group-conversation";
import {WeddingAnnouncementSchema} from "./models/wedding-annoucement.model";
import {WeddingServicesSchema} from "./models/wedding-services.model";
import {WeddingRegistrySchema} from "./models/wedding-registry.model";
import {WeddingAlbumSchema} from "./models/wedding-album.model";
import {UserSchema} from "../users/models/users.model";
import {OrderOfProceedingSchema} from "./models/order-of-proceeding.model";
import {PlaylistSchema} from "./models/playlist.model";
import {VowSchema} from "./models/vow.model";
import {BudgetPlannerSchema} from "./models/budget-planner.model";
import {ContactSchema} from "../users/models/contacts.model";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ChatService} from "../modeling/chat.service";
import {ModelingSchema} from "../modeling/models/modeling.model";

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            {name: 'wedding', schema: WeddingSchema},
            {name: 'groups', schema: GroupChatSchema},
            {name: 'groupconversations', schema: GroupConversationSchema},
            {name: 'wedding-announcements', schema: WeddingAnnouncementSchema},
            {name: 'wedding-services', schema: WeddingServicesSchema},
            {name: 'wedding-registries', schema: WeddingRegistrySchema},
            {name: 'wedding-albums', schema: WeddingAlbumSchema},
            {name: 'users', schema: UserSchema},
            {name: 'order-of-proceedings', schema: OrderOfProceedingSchema},
            {name: 'playlists', schema: PlaylistSchema},
            {name: 'vows', schema: VowSchema},
            {name: 'budget-planners', schema: BudgetPlannerSchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'users', schema: UserSchema},
            {name: 'models', schema: ModelingSchema},


        ]),
    ],
    providers: [WeddingService, GroupChatService,ModelingGateway,ChatService],
    controllers: [WeddingController],
})
export class WeddingModule {
}
