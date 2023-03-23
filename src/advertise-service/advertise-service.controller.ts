import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdvertiseServiceService } from './advertise-service.service';
import {
  CreateAdvertiseServiceDto,
  UpdateAdvertiseServiceDto,
} from './dtos/advertise-service.dto';

@Controller('advertise-service')
export class AdvertiseServiceController {
  constructor(private advertiseServiceService: AdvertiseServiceService) {}

  @Post('/')
  async createAdvertiseService(@Body() body: CreateAdvertiseServiceDto) {
    const response = await this.advertiseServiceService.create(body);
    return response;
  }

  @Put('/')
  async updateAdvertiseService(@Body() body: UpdateAdvertiseServiceDto) {
    const response = await this.advertiseServiceService.update(body);
    return response;
  }

  @Get('/')
  async getAllAdvertiseService() {
    const response = await this.advertiseServiceService.getAll();
    return response;
  }

  @Get('/:id')
  async getAdvertiseServiceById(@Param('id') id: string) {
    const response = await this.advertiseServiceService.getbyId(id);
    return response;
  }

  @Get('/user/:id')
  async getAdvertiseServiceByuserId(@Param('id') id: string) {
    const response = await this.advertiseServiceService.getbyUserId(id);
    return response;
  }
}
