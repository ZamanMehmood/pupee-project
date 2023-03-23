import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ServicesSchema} from "../services/models/services.model";
import {UserSchema} from "../users/models/users.model";
import {NotificationSchema} from "./models/notification.model";
import {NotificationController} from "./notification.controller";
import {NotificationService} from "./notification.service";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ChatService} from "../modeling/chat.service";
import {ContactSchema} from "../users/models/contacts.model";
import {WeddingSchema} from "../wedding/models/wedding.model";
import {ModelingSchema} from "../modeling/models/modeling.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'notifications', schema: NotificationSchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'wedding', schema: WeddingSchema},
            {name: 'users', schema: UserSchema},
            {name: 'models', schema: ModelingSchema},

        ]),
    ],
    controllers: [NotificationController],
    providers: [NotificationService,ModelingGateway,ChatService],
})
export class NotificationModule {
}
