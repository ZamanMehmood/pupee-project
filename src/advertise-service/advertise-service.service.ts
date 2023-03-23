import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import {
  CreateAdvertiseServiceDto,
  UpdateAdvertiseServiceDto,
} from './dtos/advertise-service.dto';
import { AdvertiseServiceDocument } from './models/advertise-service.model';

@Injectable()
export class AdvertiseServiceService {
  constructor(
    @InjectModel('advertise-services')
    private readonly advertiseServiceModel: Model<AdvertiseServiceDocument>,
  ) {}

  async create(payload: CreateAdvertiseServiceDto) {
    const newAdvertiseService = new this.advertiseServiceModel(payload);
    const saveAdvertiseService = await newAdvertiseService.save();
    return successResponse(200, 'Advertise created', saveAdvertiseService);
  }

  async update(payload: UpdateAdvertiseServiceDto) {
    const {
      advertise_service_id,
      service_name,
      age_min,
      age_max,
      gender,
      occupations,
      interests,
      keywords,
      search_history,
      selected_audience,
      business_category,
      start_date,
      total_budget,
      duration,
      goal,
      Stripe_token,
    } = payload;
    let findAdvertiseService = await this.advertiseServiceModel.findById(
      advertise_service_id,
    );
    if (!findAdvertiseService) {
      return errorResponse(404, 'Advertise Service not found');
    }
    findAdvertiseService.service_name =
      service_name || findAdvertiseService.service_name;
    findAdvertiseService.age_min = age_min || findAdvertiseService.age_min;
    findAdvertiseService.age_max = age_max || findAdvertiseService.age_max;
    findAdvertiseService.gender = gender || findAdvertiseService.gender;
    findAdvertiseService.goal = goal || findAdvertiseService.goal;
    findAdvertiseService.Stripe_token =
      Stripe_token || findAdvertiseService.Stripe_token;
    findAdvertiseService.occupations =
      occupations || findAdvertiseService.occupations;
    findAdvertiseService.interests =
      interests || findAdvertiseService.interests;
    findAdvertiseService.keywords = keywords || findAdvertiseService.keywords;
    findAdvertiseService.search_history =
      search_history || findAdvertiseService.search_history;
    findAdvertiseService.selected_audience =
      selected_audience || findAdvertiseService.selected_audience;
    findAdvertiseService.business_category =
      business_category || findAdvertiseService.business_category;
    findAdvertiseService.start_date =
      start_date || findAdvertiseService.start_date;
    findAdvertiseService.total_budget =
      total_budget || findAdvertiseService.total_budget;
    findAdvertiseService.duration = duration || findAdvertiseService.duration;

    const updateAdvertiseService = await findAdvertiseService.save();

    return successResponse(
      200,
      'Advertise Service updated successfully',
      updateAdvertiseService,
    );
  }

  async getAll() {
    const adverticeServices = await this.advertiseServiceModel.find({});
    if (adverticeServices) {
      return successResponse(200, 'Advertise Services', adverticeServices);
    } else {
      return errorResponse(404, 'Advertise Services not found');
    }
  }

  async getbyUserId(id: string) {
    const adverticeServices = await this.advertiseServiceModel.find({
      user_id: id,
    });
    if (adverticeServices) {
      return successResponse(200, 'Advertise Services', adverticeServices);
    } else {
      return errorResponse(404, 'Advertise Services not found');
    }
  }

  async getbyId(id: string) {
    const adverticeServices = await this.advertiseServiceModel.findById(id);
    if (adverticeServices) {
      return successResponse(200, 'Advertise Services', adverticeServices);
    } else {
      return errorResponse(404, 'Advertise Services not found');
    }
  }
}
