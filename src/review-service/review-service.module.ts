import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesModule } from '../services/services.module';
import { ReviewServiceSchema } from './models/review-service.model';
import { ReviewServiceController } from './review-service.controller';
import { ReviewServiceService } from './review-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'reviewservices',
        schema: ReviewServiceSchema,
      },
    ]),
    ServicesModule,
  ],
  controllers: [ReviewServiceController],
  providers: [ReviewServiceService],
})
export class ReviewServiceModule {}
