import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { CreateTimeSlotsDto } from './dtos/time-slots.dto';
import { TimeSlotsDocument } from './models/time-slots.models';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectModel('timeslots')
    private readonly timeSlotsModel: Model<TimeSlotsDocument>,
  ) {}

  create = async (timeSlotsDto: CreateTimeSlotsDto) => {
    const timeSlots = new this.timeSlotsModel(timeSlotsDto);
    const saveTimeSlots = await timeSlots.save();
    return successResponse(200, 'Time Slot created', saveTimeSlots);
  };

  getSlotsByServiceId = async (id: String) => {
    const timeSlots = await this.timeSlotsModel.find({ service_id: id });
    if (timeSlots) {
      return successResponse(200, 'Time Slots', timeSlots);
    } else {
      return errorResponse(404, 'Time Slots not found');
    }
  };
}
