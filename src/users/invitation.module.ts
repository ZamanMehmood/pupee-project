import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ServicesSchema} from "../services/models/services.model";
import {ChatService} from "../modeling/chat.service";
import {NotificationController} from "../notifications/notification.controller";
import {InvitationController} from "./invitation.controller";
import {InvitationService} from "./invitation.service";
import {InvitationSchema} from "./models/invite-notification.model";
import {ModelingSchema} from "../modeling/models/modeling.model";
import {UserSchema} from "./models/users.model";
import {NotificationService} from "../notifications/notification.service";
import {NotificationSchema} from "../notifications/models/notification.model";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ContactSchema} from "./models/contacts.model";
import {WeddingSchema} from "../wedding/models/wedding.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'contacts', schema: ContactSchema},
            {name: 'notifications', schema: NotificationSchema},
            {name: 'invitations', schema: InvitationSchema},
            {name: 'wedding', schema: WeddingSchema},
            {name: 'users', schema: UserSchema},
            {name: 'models', schema: ModelingSchema},

        ]),
    ],
    controllers: [InvitationController],
    providers: [InvitationService,ModelingGateway,ChatService,NotificationService],
})
export class InvitationModule {
}
