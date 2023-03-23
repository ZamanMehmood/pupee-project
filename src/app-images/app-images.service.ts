import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { CreateAppImageDto } from './dtos/app-images.dto';
import { AppImageDocument } from './models/app-images.model';

@Injectable()
export class AppImagesService {
  constructor(
    @InjectModel('appimages')
    private readonly appImageModel: Model<AppImageDocument>,
  ) {}

  async create(payload: CreateAppImageDto) {
    const newAppImage = new this.appImageModel({
      image_url: payload.image_url,
    });
    const saveAppImage = await newAppImage.save();
    return successResponse(200, 'App Image created', saveAppImage);
  }

  async getAll() {
    const appImages = await this.appImageModel.find({});
    if (appImages) {
      return successResponse(200, 'App Images', appImages);
    } else {
      return errorResponse(404, 'Images not found.');
    }
  }
}
