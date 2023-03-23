import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ModelingSchema} from "./models/modeling.model";
import {ModelingController} from "./modeling.controller";
import {ModelingService} from "./modeling.service";
import {VoteSchema} from "./models/vote.models";
import {UserSchema} from "../users/models/users.model";
import {ModelingStatsSchema} from "./models/stats.model";
import {ModelChatSchema} from "./models/chat.model";
import {ModelRatingCategorySchema} from "./models/rating-category.models";
import {ContactSchema} from "../users/models/contacts.model";
import {ModelingGateway} from "./modeling.gateway";
import {ChatService} from "./chat.service";
import {BuyPortfolioSchema} from "./models/buy-portfolio.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'models', schema: ModelingSchema},
            {name: 'votes', schema: VoteSchema},
            {name: 'users', schema: UserSchema},
            {name: 'model-stats', schema: ModelingStatsSchema},
            {name: 'model-chats', schema: ModelChatSchema},
            {name: 'model-rating-category', schema: ModelRatingCategorySchema},
            {name: 'contacts', schema: ContactSchema},
            {name: 'buy-portfolios', schema: BuyPortfolioSchema},

        ]),
    ],
    controllers: [ModelingController],
    providers: [ModelingService,ModelingGateway,ChatService],
})
export class ModelingModule {
}
