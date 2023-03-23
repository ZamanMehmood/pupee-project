import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateOccupationDto } from './dtos/occupation.dto';
import { OccupationDocument } from './models/occupation.model';

@Injectable()
export class OccupationsService {
  constructor(
    @InjectModel('occupations')
    private readonly occupationModel: Model<OccupationDocument>,
  ) {}

  async create(name: string) {
    const occupation = new this.occupationModel({ name });
    const saveOccupation = await occupation.save();
    return successResponse(200, 'Occupation Created', saveOccupation);
  }

  async update(payload: UpdateOccupationDto) {
    const occupation = await this.occupationModel.findById(
      payload.occupation_id,
    );
    if (occupation) {
      occupation.name = payload.name || occupation.name;
      await occupation.save();
      return successResponse(200, 'Occupation Updated', occupation);
    } else {
      return errorResponse(404, 'Occupation not fount');
    }
  }

  async getAll() {
    const occupations = await this.occupationModel.find({});
    if (occupations) {
      return successResponse(200, 'Occupations', occupations);
    } else {
      return errorResponse(404, 'Occupations not fount');
    }
  }
}
