import { Body, Controller, Get, Post } from '@nestjs/common';
import { AffliatedLinksService } from './affliated-links.service';
import { CreateAffliateLinkDto } from './dtos/affliate-links.dto';

@Controller('affliated-links')
export class AffliatedLinksController {
  constructor(private affliateService: AffliatedLinksService) {}

  @Post('/')
  async create(@Body() body: CreateAffliateLinkDto) {
    const post = await this.affliateService.createAffliateLink(body);
    return post;
  }

  @Get('/')
  async getAll() {
    const post = await this.affliateService.getAllAffliateLink();
    return post;
  }
}
