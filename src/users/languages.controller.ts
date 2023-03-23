import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateLanguageDto, UpdateLanguageDto } from './dtos/language.dto';
import { LanguagesService } from './languages.service';

@Controller('languages')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Post('/')
  async createLanguage(@Body() body: CreateLanguageDto) {
    const language = await this.languagesService.create(body.name);
    return language;
  }

  @Put('/')
  async updateLanguahe(@Body() body: UpdateLanguageDto) {
    const language = await this.languagesService.update(body);
    return language;
  }

  @Get('/')
  async getAllLanguages() {
    const languages = await this.languagesService.getAll();
    return languages;
  }
}
