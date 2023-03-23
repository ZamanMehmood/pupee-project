import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AffliatedLinksController } from './affliated-links.controller';
import { AffliatedLinksService } from './affliated-links.service';
import { AffliateLinksSchema } from './models/affliate-links.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'affliatelinks',
        schema: AffliateLinksSchema,
      },
    ]),
  ],
  controllers: [AffliatedLinksController],
  providers: [AffliatedLinksService],
})
export class AffliatedLinksModule {}
