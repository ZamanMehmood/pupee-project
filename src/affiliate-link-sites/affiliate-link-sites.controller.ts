import { Body, Controller, Get, Post } from '@nestjs/common';
import { AffiliateLinkSitesService } from './affiliate-link-sites.service';
import { CreateAffliateLinkSiteDto } from './dtos/affiliate-link-sites.dto';

@Controller('affiliate-link-sites')
export class AffiliateLinkSitesController {
  constructor(private affliateService: AffiliateLinkSitesService) {}

  @Post('/')
  async create(@Body() body: CreateAffliateLinkSiteDto) {
    const post = await this.affliateService.createAffliateLinkSite(body);
    return post;
  }

  @Get('/')
  async getAll() {
    const post = await this.affliateService.getAllAffliateLinkSites();
    return post;
  }
}
