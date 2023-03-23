import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTimeSlotsDto } from './dtos/time-slots.dto';
import { TimeSlotsService } from './time-slots.service';
import mongoose from 'mongoose';
import { errorResponse } from '../utils/response';

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private timeSlotsService: TimeSlotsService) {}

  @Post('/')
  async create(@Body() body: CreateTimeSlotsDto) {
    const service = await this.timeSlotsService.create(body);
    return service;
  }

  @Get('/service/:id')
  async getByServiceId(@Param('id') id: String) {
    let checkUserId = mongoose.isValidObjectId(id);
    if (!checkUserId) {
      return errorResponse(500, 'serviceId is not a valid id');
    }
    const service = await this.timeSlotsService.getSlotsByServiceId(id);
    return service;
  }
}
