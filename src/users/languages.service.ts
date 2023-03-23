import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateLanguageDto } from './dtos/language.dto';
import { LanguageDocument } from './models/languages.model';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel('languages')
    private readonly languageModel: Model<LanguageDocument>,
  ) {}

  async create(name: string) {
    const language = new this.languageModel({ name });
    const saveLanguage = await language.save();
    return successResponse(200, 'Language Created', saveLanguage);
  }

  async update(payload: UpdateLanguageDto) {
    const language = await this.languageModel.findById(payload.language_id);
    if (language) {
      language.name = payload.name || language.name;
      await language.save();
      return successResponse(200, 'Language Updated', language);
    } else {
      return errorResponse(404, 'Language not fount');
    }
  }

  async getAll() {
    const languages = await this.languageModel.find({});
    if (languages) {
      return successResponse(200, 'Languages', languages);
    } else {
      return errorResponse(404, 'Languages not fount');
    }
  }
}
