import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {PostsModule} from './posts/posts.module';
import {ProductsModule} from './products/products.module';
import {AffliatedLinksModule} from './affliated-links/affliated-links.module';
import {CustomReviewModule} from './custom-review/custom-review.module';
import {ServicesModule} from './services/services.module';
import {UserPaymentCardsModule} from './user-payment-cards/user-payment-cards.module';
import {TimeSlotsModule} from './time-slots/time-slots.module';
import {ServiceOrdersModule} from './service-orders/service-orders.module';
import {AffiliateLinkSitesModule} from './affiliate-link-sites/affiliate-link-sites.module';
import {ReviewServiceModule} from './review-service/review-service.module';
import {GoalsModule} from './goals/goals.module';
import {KeywordsModule} from './keywords/keywords.module';
import {SearchHistoryModule} from './search-history/search-history.module';
import {AdvertiseServiceModule} from './advertise-service/advertise-service.module';
import {AppImagesModule} from './app-images/app-images.module';
import {BankNameModule} from './bank-name/bank-name.module';
import {WithdrawMethodModule} from './withdraw-method/withdraw-method.module';
import {GroupChatModule} from "./group-chat/group-chat.module";
import {WeddingModule} from "./wedding/wedding.module";
import {SocialAuthModule} from "./social-auth/social-auth.module";
import {ModelingModule} from "./modeling/modeling.module";
import {StaticDataModule} from "./static-data/static-data.module";
import {RatingModule} from "./rating/rating.module";
import {NotificationModule} from "./notifications/notification.module";

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {InvitationModule} from "./users/invitation.module";
import {HashtagModule} from "./hashtags/hashtag.module";

// mongodb+srv://hassan:hassan123@cluster0.cnj46.mongodb.net/pupeee?retryWrites=true&w=majority
// mongodb://localhost:27017/pupeee
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        MongooseModule.forRoot(
            process.env.DATABASE_URL,
        ),
        UsersModule,
        PostsModule,
        ProductsModule,
        AffliatedLinksModule,
        CustomReviewModule,
        ServicesModule,
        UserPaymentCardsModule,
        TimeSlotsModule,
        ServiceOrdersModule,
        AffiliateLinkSitesModule,
        ReviewServiceModule,
        GoalsModule,
        KeywordsModule,
        SearchHistoryModule,
        AdvertiseServiceModule,
        AppImagesModule,
        BankNameModule,
        WithdrawMethodModule,
        GroupChatModule,
        WeddingModule,
        SocialAuthModule,
        ModelingModule,
        StaticDataModule,
        RatingModule,
        NotificationModule,
        InvitationModule,
        HashtagModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
