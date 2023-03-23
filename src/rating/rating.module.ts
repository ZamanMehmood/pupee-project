import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {RatingSchema} from './models/rating.model';
import {RatingService} from './rating.service';
import {RatingController} from "./rating.controller";
import {ServicesSchema} from "../services/models/services.model";
import {UserSchema} from "../users/models/users.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'ratings', schema: RatingSchema},
            {name: 'services', schema: ServicesSchema},
            {name: 'users', schema: UserSchema},
        ]),
    ],
    controllers: [RatingController],
    providers: [RatingService],
})
export class RatingModule {
}
