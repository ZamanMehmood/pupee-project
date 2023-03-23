import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {HashtagSchema} from "./models/hashtag.model";
import {HashtagService} from "./hashtag.service";
import {HashtagController} from "./hashtag.controller";
import {UserSchema} from "../users/models/users.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'hashtags', schema: HashtagSchema},
            {name: 'users', schema: UserSchema},

        ]),
    ],
    controllers: [HashtagController],
    providers: [HashtagService,],
})
export class HashtagModule {
}
