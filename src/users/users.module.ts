import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {NotificationsService} from './notifications.service';
import {UserSchema} from './models/users.model';
import {AuthService} from './auth.service';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {CurrentUserInterceptor} from './interceptors/current-user.interceptor';
import {OccupationsSchema} from './models/occupation.model';
import {InterestsSchema} from './models/interests.model';
import {LanguagesSchema} from './models/languages.model';
import {InterestsService} from './interests.service';
import {OccupationsService} from './occupations.service';
import {LanguagesService} from './languages.service';
import {OccupationsController} from './occupations.controller';
import {LanguagesController} from './languages.controller';
import {InterestsController} from './interests.controller';
import {NotificationsController} from './notifications.controller';
import {VerifyUserSchema} from "./models/verify-users.model";
import {ServiceOrdersSchema} from "../service-orders/models/service-orders.model";
import {RatingSchema} from "../rating/models/rating.model";
import {ReportProblemSchema} from "./models/report-problem.model";
import {AdminSchema} from "./models/admin.model";
import {AdminController} from "./admin.controller";
import {ModelingSchema} from "../modeling/models/modeling.model";
import {ContactSchema} from "./models/contacts.model";
import {InvitationSchema} from "./models/invite-notification.model";
import {InvitationController} from "./invitation.controller";
import {InvitationService} from "./invitation.service";
import {NotificationService} from "../notifications/notification.service";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ChatService} from "../modeling/chat.service";
import {NotificationSchema} from "../notifications/models/notification.model";
import {WeddingSchema} from "../wedding/models/wedding.model";
import {PostsSchema} from "../posts/models/posts.model";
import {ServicesSchema} from "../services/models/services.model";
import {FeedbackSchema} from "./models/feedback.model";
import {StorageSchema} from "./models/storage.model";
import {StorageController} from "./storage.controller";
import {StorageService} from "./storage.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'verifyusers', schema: VerifyUserSchema},
            {name: 'users', schema: UserSchema},
            {name: 'occupations', schema: OccupationsSchema},
            {name: 'interests', schema: InterestsSchema},
            {name: 'languages', schema: LanguagesSchema},
            {name: 'serviceorders', schema: ServiceOrdersSchema},
            {name: 'ratings', schema: RatingSchema},
            {name: 'report-problems', schema: ReportProblemSchema},
            {name: 'admin', schema: AdminSchema},
            {name: 'models', schema: ModelingSchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'invitations', schema: InvitationSchema},
            {name: 'notifications', schema: NotificationSchema},
            {name: 'wedding', schema: WeddingSchema},
            {name: 'posts', schema: PostsSchema},
            { name: 'services', schema: ServicesSchema },
            { name: 'feedbacks', schema: FeedbackSchema },
            { name: 'storages', schema: StorageSchema },

        ]),
    ],
    controllers: [
        UsersController,
        OccupationsController,
        LanguagesController,
        InterestsController,
        NotificationsController,
        AdminController,
        StorageController
    ],
    providers: [
        UsersService,
        InterestsService,
        OccupationsService,
        LanguagesService,
        NotificationsService,
        AuthService,
        NotificationService,
        InvitationService,
        ModelingGateway,
        ChatService,
        StorageService,
        {
            provide: APP_INTERCEPTOR,
            useClass: CurrentUserInterceptor,
        },
    ],
})
export class UsersModule {
}
