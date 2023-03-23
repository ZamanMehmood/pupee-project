import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { successResponse } from '../utils/response';
import { CreateCustomReviewDto } from './dtos/create-custom-review';
import { CustomReviewsDocument } from './models/create-custom-model';

@Injectable()
export class CustomReviewService {
  constructor(
    @InjectModel('customreviews')
    private readonly customReviews: Model<CustomReviewsDocument>,
    @Inject(PostsService)
    private readonly postService: PostsService,
  ) {}

  create = async (payload: CreateCustomReviewDto) => {
    const customReviews = new this.customReviews(payload);
    await customReviews.save();
    return this.postService.createSingleReview(payload.name);
  };

  getAll = async () => {
    const customReviews = await this.customReviews.find({});
    return successResponse(200, 'All Custom Reviews', customReviews);
  };
}
