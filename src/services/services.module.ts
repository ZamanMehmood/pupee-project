import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesSchema } from './models/services.model';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import {UserSchema} from "../users/models/users.model";
import {RatingSchema} from "../rating/models/rating.model";

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'services', schema: ServicesSchema },
        {name: 'users', schema: UserSchema},
        {name: 'ratings', schema: RatingSchema},
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, MongooseModule],
})
export class ServicesModule {}
