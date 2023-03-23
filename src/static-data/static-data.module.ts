import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticDataController } from './static-data.controller';
import { StaticDataService } from './static-data.service';
import { StaticDataSchema } from './models/static-data.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'static-data', schema: StaticDataSchema }]),
  ],
  controllers: [StaticDataController],
  providers: [StaticDataService],
})
export class StaticDataModule {}
