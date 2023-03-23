import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateInterestDto, UpdateInterestDto } from './dtos/interest.dto';
import { InterestsService } from './interests.service';

@Controller('interests')
export class InterestsController {
  constructor(private interestsService: InterestsService) {}

  @Post('/')
  async createInterest(@Body() body: CreateInterestDto) {
    const interest = await this.interestsService.create(body.name);
    return interest;
  }

  @Put('/')
  async updateInterest(@Body() body: UpdateInterestDto) {
    const interest = await this.interestsService.update(body);
    return interest;
  }

  @Get('/')
  async getAllInterests() {
    const interests = await this.interestsService.getAll();
    return interests;
  }
}
