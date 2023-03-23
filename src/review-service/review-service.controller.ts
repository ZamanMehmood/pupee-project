import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateReviewServiceDto } from './dtos/review-service.dto';
import { ReviewServiceService } from './review-service.service';

@Controller('review-service')
export class ReviewServiceController {
  constructor(private reviewServiceService: ReviewServiceService) {}

  @Post('/')
  async create(@Body() bodey: CreateReviewServiceDto) {
    const response = await this.reviewServiceService.create(bodey);
    return response;
  }

  @Get('/service_id/:id')
  async hetByServiceId(@Param('id') id: string) {
    const response = await this.reviewServiceService.getByServiceId(id);
    return response;
  }

  @Get('/user_id/:id')
  async hetByUserId(@Param('id') id: string) {
    const response = await this.reviewServiceService.getByUserId(id);
    return response;
  }

  @Get('/order_id/:id')
  async hetByOrderId(@Param('id') id: string) {
    const response = await this.reviewServiceService.getByOrderId(id);
    return response;
  }

  @Get('/service_provider_id/:id')
  async hetByServiceProviderId(@Param('id') id: string) {
    const response = await this.reviewServiceService.getByServiceProviderId(id);
    return response;
  }

  @Get('/all')
  async getAll() {
    const response = await this.reviewServiceService.getAll();
    return response;
  }
}
