import {Module} from '@nestjs/common';
import {ServiceOrdersService} from './service-orders.service';
import {ServiceOrdersController} from './service-orders.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {ServiceOrdersSchema} from './models/service-orders.model';
import {ServiceOrderConversationSchema} from './models/service-order-conversation.model';
import {UserSchema} from "../users/models/users.model";
import {NotificationService} from "../notifications/notification.service";
import {NotificationSchema} from "../notifications/models/notification.model";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ChatService} from "../modeling/chat.service";
import {ContactSchema} from "../users/models/contacts.model";
import {WeddingSchema} from "../wedding/models/wedding.model";
import {ModelingSchema} from "../modeling/models/modeling.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'serviceorders', schema: ServiceOrdersSchema},
            {
                name: 'serviceorderconversations',
                schema: ServiceOrderConversationSchema,
            },
            {name: 'users', schema: UserSchema},
            {name: 'notifications', schema: NotificationSchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'wedding', schema: WeddingSchema},
            {name: 'models', schema: ModelingSchema},

        ]),
    ],
    providers: [ServiceOrdersService,NotificationService,ChatService,ModelingGateway],
    controllers: [ServiceOrdersController],
})
export class ServiceOrdersModule {
}
