import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from '../posts/dtos/reviews.dto';
import { ServicesDocument } from '../services/models/services.model';
import { errorResponse, successResponse } from '../utils/response';
import { CreateReviewServiceDto } from './dtos/review-service.dto';
import { ReviewServiceDocument } from './models/review-service.model';

@Injectable()
export class ReviewServiceService {
  constructor(
    @InjectModel('reviewservices')
    private readonly reviewServiceModel: Model<ReviewServiceDocument>,
    @InjectModel('services')
    private readonly servicesModel: Model<ServicesDocument>,
  ) {}

  async create(reviewServiceDto: CreateReviewServiceDto) {
    const newReviewService = new this.reviewServiceModel(reviewServiceDto);
    let averagerating =
      reviewServiceDto.communication +
      reviewServiceDto.service_as_described +
      reviewServiceDto.would_recomment;
    let get_average = averagerating / 3;
    let round_off = get_average.toFixed(2);
    newReviewService.rating = round_off;
    const service = await this.servicesModel.findById(
      reviewServiceDto.service_id,
    );
    let average_rating = 0;
    let reviews_count = 0;
    if (service) {
      const findServiceAllReviews = await this.reviewServiceModel.find({
        service_id: reviewServiceDto.service_id,
      });
      if (findServiceAllReviews) {
        findServiceAllReviews.forEach((data) => {
          average_rating = average_rating + data.rating;
        });
      }
      average_rating = average_rating + newReviewService.rating;
      reviews_count = findServiceAllReviews.length + 1;
      let service_avg = average_rating / reviews_count;
      service.average_rating = service_avg.toFixed(2);
      service.reviews_count = reviews_count;
      await service.save();
    }
    const saveReviewService = await newReviewService.save();
    return successResponse(200, 'Review Service Created', saveReviewService);
  }

  async getByUserId(id: String) {
    const findReviews = await this.reviewServiceModel
      .find({ user_id: id })
      .populate('user_id');

    if (findReviews) {
      return successResponse(200, 'Review Services', findReviews);
    } else {
      return errorResponse(404, 'Reviews Service not found');
    }
  }

  async getByServiceId(id: String) {
    const findReviews = await this.reviewServiceModel
      .find({ service_id: id })
      .populate('user_id');

    if (findReviews) {
      return successResponse(200, 'Review Services', findReviews);
    } else {
      return errorResponse(404, 'Reviews Service not found');
    }
  }

  async getByOrderId(id: String) {
    const findReviews = await this.reviewServiceModel
      .find({ order_id: id })
      .populate('user_id');

    if (findReviews) {
      return successResponse(200, 'Review Services', findReviews);
    } else {
      return errorResponse(404, 'Reviews Service not found');
    }
  }

  async getByServiceProviderId(id: String) {
    const findReviews = await this.reviewServiceModel
      .find({
        service_provider_id: id,
      })
      .populate('user_id');

    if (findReviews) {
      return successResponse(200, 'Review Services', findReviews);
    } else {
      return errorResponse(404, 'Reviews Service not found');
    }
  }

  async getAll() {
    const findReviews = await this.reviewServiceModel
      .find({})
      .populate('user_id');

    if (findReviews) {
      return successResponse(200, 'Review Services', findReviews);
    } else {
      return errorResponse(404, 'Reviews Service not found');
    }
  }
}
