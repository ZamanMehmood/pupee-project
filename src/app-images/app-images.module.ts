import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppImagesController } from './app-images.controller';
import { AppImagesService } from './app-images.service';
import { AppImageSchema } from './models/app-images.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'appimages', schema: AppImageSchema }]),
  ],
  controllers: [AppImagesController],
  providers: [AppImagesService],
})
export class AppImagesModule {}
