import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvertiseServiceController } from './advertise-service.controller';
import { AdvertiseServiceService } from './advertise-service.service';
import { AdvertiseServiceSchema } from './models/advertise-service.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'advertise-services', schema: AdvertiseServiceSchema },
    ]),
  ],
  controllers: [AdvertiseServiceController],
  providers: [AdvertiseServiceService],
})
export class AdvertiseServiceModule {}
