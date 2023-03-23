import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppImagesService } from './app-images.service';
import { CreateAppImageDto } from './dtos/app-images.dto';

@Controller('app-images')
export class AppImagesController {
  constructor(private appImageService: AppImagesService) {}

  @Post('/')
  async createAppImage(@Body() body: CreateAppImageDto) {
    const response = await this.appImageService.create(body);
    return response;
  }

  @Get('/')
  async getAllAppImages() {
    const response = await this.appImageService.getAll();
    return response;
  }
}
