import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomReviewService } from './custom-review.service';
import { CreateCustomReviewDto } from './dtos/create-custom-review';

@Controller('custom-review')
export class CustomReviewController {
  constructor(private customreviewService: CustomReviewService) {}

  @Post('/')
  async create(@Body() body: CreateCustomReviewDto) {
    const customReview = await this.customreviewService.create(body);
    return customReview;
  }

  @Get('/')
  async getAll() {
    const customReviews = await this.customreviewService.getAll();
    return customReviews;
  }
}
