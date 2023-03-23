import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {PostsController} from './posts.controller';
import {PostsService} from './posts.service';
import {PostsSchema} from './models/posts.model';
import {CommentsSchema} from './models/comments.model';
import {SubCommentsSchema} from './models/sub-comments.model';
import {ReviewsSchema} from './models/reviews.model';
import {PostDislikesSchema} from "./models/post dislikes";
import {PostLikesSchema} from "./models/post-likes";
import {UserSchema} from "../users/models/users.model";
import {NotificationService} from "../notifications/notification.service";
import {NotificationSchema} from "../notifications/models/notification.model";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {ChatService} from "../modeling/chat.service";
import {ContactSchema} from "../users/models/contacts.model";
import {WeddingSchema} from "../wedding/models/wedding.model";
import {HashtagService} from "../hashtags/hashtag.service";
import {HashtagSchema} from "../hashtags/models/hashtag.model";
import {ModelingSchema} from "../modeling/models/modeling.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'posts', schema: PostsSchema},
            {name: 'comments', schema: CommentsSchema},
            {name: 'subcomments', schema: SubCommentsSchema},
            {name: 'reviews', schema: ReviewsSchema},
            {name: 'post_likes', schema: PostLikesSchema},
            {name: 'post_dislikes', schema: PostDislikesSchema},
            {name: 'users', schema: UserSchema},
            {name: 'notifications', schema: NotificationSchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'wedding', schema: WeddingSchema},
            {name: 'hashtags', schema: HashtagSchema},
            {name: 'models', schema: ModelingSchema},

        ]),
    ],
    controllers: [PostsController],
    providers: [PostsService,NotificationService,ChatService,HashtagService,ModelingGateway],
    exports: [PostsService],
})
export class PostsModule {
}
