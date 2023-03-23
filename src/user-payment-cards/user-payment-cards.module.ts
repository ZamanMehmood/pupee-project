import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserPaymentCardsSchema} from './models/user-payment-cards.model';
import {UserPaymentCardsController} from './user-payment-cards.controller';
import {UserPaymentCardsService} from './user-payment-cards.service';
import {UserSchema} from "../users/models/users.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'userpaymentcards', schema: UserPaymentCardsSchema},
            {name: 'users', schema: UserSchema},

        ]),
    ],
    controllers: [UserPaymentCardsController],
    providers: [UserPaymentCardsService],
})
export class UserPaymentCardsModule {
}
