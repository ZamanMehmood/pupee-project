import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { CreateAffliateLinkSiteDto } from './dtos/affiliate-link-sites.dto';
import { AffliateLinkSitesDocument } from './models/affiliate-link-sites.model';

@Injectable()
export class AffiliateLinkSitesService {
  constructor(
    @InjectModel('affliatelinksites')
    private readonly affliateLinksites: Model<AffliateLinkSitesDocument>,
  ) {}

  createAffliateLinkSite = async (payload: CreateAffliateLinkSiteDto) => {
    const affliateLink = new this.affliateLinksites(payload);
    const saveAffliateLink = await affliateLink.save();
    return successResponse(
      200,
      'Affliate Link Sites created',
      saveAffliateLink,
    );
  };

  getAllAffliateLinkSites = async () => {
    const affliateLinks = await this.affliateLinksites.find({});
    if (affliateLinks) {
      return successResponse(200, 'Affliate Link Sites', affliateLinks);
    } else {
      return errorResponse(404, 'Affliate Link Sites not found');
    }
  };
}
