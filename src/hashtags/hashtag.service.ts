import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {HashtagDocument} from "./models/hashtag.model";
import {CreateNotificationDto} from "../notifications/dtos/notification.dto";
import {NotificationTypeEnum} from "../enums/notification.enum";
import {errorResponse} from "../utils/response";
import {UserDocument} from "../users/models/users.model";


@Injectable()
export class HashtagService {
    constructor(
        @InjectModel('hashtags') private readonly hashtagModel: Model<HashtagDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
    ) {
    }

    saveAndAddPost = async (postId: string, hashTagTitle: string) => {
        const hashTag = await this.hashtagModel.findOneAndUpdate(
            {title: hashTagTitle},
            {$push: {posts: postId}},
            {upsert: true});
        return hashTag;
    };


    incrementHashtagCount = async (hashTagTitle: string) => {
        const hashTag = await this.hashtagModel.findOneAndUpdate(
            {title: hashTagTitle},
            {$inc: {count: 1}})
        return hashTag;
    };


    get = async () => {
        const hashTag = await this.hashtagModel.find({}).select('_id title count').sort({count: -1});
        return hashTag;
    };

    getHashtagPosts = async (userId: string, hashtag: string) => {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId));
        if (user) {
            let searched_results = user.searched_results || [];
            const findHashTagIndex = searched_results.findIndex((searched) =>searched.hashtag === hashtag);
            if(findHashTagIndex>=0){
                searched_results.splice(findHashTagIndex,1);
            }
            searched_results.splice(0,0,{hashtag,last_searched:new Date().toISOString()});
            await user.save();
        }
        await this.incrementHashtagCount(hashtag);
        const hashTag = await this.hashtagModel.find({title: hashtag}).populate('posts')
            .populate({
                path : 'posts',
                populate : {
                    path : 'userId',
                    select:'_id first_name last_name user_name email profile_image_url'
                }
            });
        return hashTag;
    };



}
