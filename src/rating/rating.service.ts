import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {RatingModel} from './models/rating.model';
import {CreateRating} from "./dtos/rating.dto";
import {calculateRatingById, calculateRatingByUser} from '../utils/rating';
import {WhoseRatingEnum} from "../enums/rating.enum";
import {ServicesDocument} from "../services/models/services.model";
import {UserDocument} from "../users/models/users.model";

const stripe = require('stripe')("sk_test_51L5qqGClYFsBJMtmr6mZXJgnlM5xV2wEU9jjoP1XhAUBuH8pG5dMo02pA24LVscakTih8HqLpqCEFxylMfrbv8Rf00Hyh8bIXv");

@Injectable()
export class RatingService {
    constructor(
        @InjectModel('ratings') private readonly ratingModel: Model<RatingModel>,
        @InjectModel('services') private readonly serviceModel: Model<ServicesDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
    ) {
    }

    addRating = async (payload: CreateRating) => {
        const rating: any = await this.ratingModel.findById(payload.rating_id);
        if (rating) {
            rating.rating[payload.type].push(payload.rating);
            const saveRating=await rating.save();
            const ratingById=calculateRatingById(saveRating);
            if(payload.whose_rating.type===WhoseRatingEnum.SERVICE){
                const services=await this.serviceModel.find({rating_id:new mongoose.Types.ObjectId(payload.rating_id)});
                if(services.length>0){
                    const service=services[0];
                    service.set({average_rating:ratingById.averageRating,reviews_count:ratingById.ratingsCount});
                    await service.save();
                }else{
                    return errorResponse(404, 'service not found');
                }
            }

            const userRating=await this.ratingModel.find({user_id:new mongoose.Types.ObjectId(rating.user_id)});
            const user=await this.userModel.findById(rating.user_id);
            if(user){
                const userServices=await this.serviceModel.find({user_id:new mongoose.Types.ObjectId(rating.user_id)}).populate("rating_id").lean()
                const userServiceRatings=userServices.map((service)=>service.rating_id);
                const ratingByUserId=calculateRatingByUser(userServiceRatings);
                user.set({rating:ratingByUserId.averageRating,reviews_count:ratingByUserId.ratingsCount});
                await user.save();
            }else{
                return errorResponse(404, 'user not found');
            }

            return successResponse(200, 'rating updated', {});
        }else{
            return errorResponse(404, 'rating not found');
        }
    };


    getRatingById = async (id: string) => {
        const ratings = await this.ratingModel.findById(id);
        if (ratings) {
            return successResponse(200, 'ratings', ratings);
        } else {
            return errorResponse(404, 'UserPaymentCards not found');
        }
    };


    getRatingByUserId = async (user_id: string) => {
        const ratings = await this.ratingModel.find({user_id:new mongoose.Types.ObjectId(user_id)});
        if (ratings) {
            return successResponse(200, 'ratings', ratings);
        } else {
            return errorResponse(404, 'UserPaymentCards not found');
        }
    };

}
