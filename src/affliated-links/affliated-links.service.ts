import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { CreateAffliateLinkDto } from './dtos/affliate-links.dto';
import { AffliateLinksDocument } from './models/affliate-links.model';

@Injectable()
export class AffliatedLinksService {
  constructor(
    @InjectModel('affliatelinks')
    private readonly affliateLinks: Model<AffliateLinksDocument>,
  ) {}

  createAffliateLink = async (payload: CreateAffliateLinkDto) => {
    const affliateLink = new this.affliateLinks(payload);
    const saveAffliateLink = await affliateLink.save();
    return successResponse(200, 'Affliate Link created', saveAffliateLink);
  };

  getAllAffliateLink = async () => {
    const affliateLinks = await this.affliateLinks.find({});
    if (affliateLinks) {
      return successResponse(200, 'Affliate Links', affliateLinks);
    } else {
      return errorResponse(404, 'Affliate Links not found');
    }
  };
}
