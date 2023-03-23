import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AffiliateLinkSitesController } from './affiliate-link-sites.controller';
import { AffiliateLinkSitesService } from './affiliate-link-sites.service';
import { AffliateLinkSitesSchema } from './models/affiliate-link-sites.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'affliatelinksites',
        schema: AffliateLinkSitesSchema,
      },
    ]),
  ],
  controllers: [AffiliateLinkSitesController],
  providers: [AffiliateLinkSitesService],
})
export class AffiliateLinkSitesModule {}
