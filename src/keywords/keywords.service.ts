import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateKeywordDto } from './dtos/keywords.dto';
import { KeywordDocument } from './models/keywords.models';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel('keywords')
    private readonly keywordModel: Model<KeywordDocument>,
  ) {}

  async create(name: string) {
    const newKeyword = new this.keywordModel({ name });
    const saveKeyword = await newKeyword.save();
    return successResponse(200, 'Keyword created', saveKeyword);
  }

  async update(payload: UpdateKeywordDto) {
    const keyword: any = await this.keywordModel.findById(payload.keyword_id);
    if (keyword) {
      keyword.name = payload.name || keyword.name;
      await keyword.save();
      return successResponse(200, 'Keyword Updated', keyword);
    } else {
      return errorResponse(404, 'Keyword not found');
    }
  }

  async getAll() {
    const keywords = await this.keywordModel.find({});
    if (keywords) {
      return successResponse(200, 'Keywords', keywords);
    } else {
      return errorResponse(404, 'Keywords not found');
    }
  }
}
