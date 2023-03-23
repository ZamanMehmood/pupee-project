import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateKeywordDto, UpdateKeywordDto } from './dtos/keywords.dto';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private keywordService: KeywordsService) {}

  @Post('/')
  async createKeyword(@Body() body: CreateKeywordDto) {
    const response = await this.keywordService.create(body.name);
    return response;
  }

  @Put('/')
  async updateKeyword(@Body() body: UpdateKeywordDto) {
    const response = await this.keywordService.update(body);
    return response;
  }

  @Get('/')
  async getAllGoals() {
    const response = await this.keywordService.getAll();
    return response;
  }
}
