import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateInterestDto } from './dtos/interest.dto';
import { InterestDocument } from './models/interests.model';

@Injectable()
export class InterestsService {
  constructor(
    @InjectModel('interests')
    private readonly interestModel: Model<InterestDocument>,
  ) {}

  async create(name: string) {
    const interest = new this.interestModel({ name });
    const saveInterest = await interest.save();
    return successResponse(200, 'Interest Created', saveInterest);
  }

  async update(payload: UpdateInterestDto) {
    const interest = await this.interestModel.findById(payload.interest_id);
    if (interest) {
      interest.name = payload.name || interest.name;
      await interest.save();
      return successResponse(200, 'Interest Updated', interest);
    } else {
      return errorResponse(404, 'Interest not fount');
    }
  }

  async getAll() {
    const interests = await this.interestModel.find({});
    if (interests) {
      return successResponse(200, 'Interests', interests);
    } else {
      return errorResponse(404, 'Interests not fount');
    }
  }
}
