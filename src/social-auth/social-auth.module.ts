import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {FacebookStrategy} from "./FacebookStrategy";
import {SocialAuthService} from "./service-auth.service";
import {SocialAuthController} from "./social-auth.controller";
import {UserSchema} from "../users/models/users.model";
import {InstagramStrategy} from "./InstagramStrategy";
import {GoogleStrategy} from "./GoogleStrategy";
import {HttpModule} from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            {name: 'users', schema: UserSchema},
        ]),
    ],
    controllers: [SocialAuthController],
    providers: [SocialAuthService, FacebookStrategy,InstagramStrategy,GoogleStrategy],
})
export class SocialAuthModule {}
