import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  CreateSearchHistoryDto,
  UpdateSearchHistoryDto,
} from './dtos/search-history.dto';
import { SearchHistoryService } from './search-history.service';

@Controller('search-history')
export class SearchHistoryController {
  constructor(private searchHistoryService: SearchHistoryService) {}

  @Post('/')
  async createGoal(@Body() body: CreateSearchHistoryDto) {
    const response = await this.searchHistoryService.create(body.name);
    return response;
  }

  @Put('/')
  async updateGoal(@Body() body: UpdateSearchHistoryDto) {
    const response = await this.searchHistoryService.update(body);
    return response;
  }

  @Get('/')
  async getAllGoals() {
    const response = await this.searchHistoryService.getAll();
    return response;
  }
}
