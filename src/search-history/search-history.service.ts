import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateSearchHistoryDto } from './dtos/search-history.dto';
import { SearchHistoryDocument } from './models/search-history.model';

@Injectable()
export class SearchHistoryService {
  constructor(
    @InjectModel('searchhistorys')
    private readonly goalModel: Model<SearchHistoryDocument>,
  ) {}

  async create(name: string) {
    const newSearchHistory = new this.goalModel({ name });
    const saveSearchHistory = await newSearchHistory.save();
    return successResponse(200, 'SearchHistory created', saveSearchHistory);
  }

  async update(payload: UpdateSearchHistoryDto) {
    const searchHistory: any = await this.goalModel.findById(
      payload.search_history_id,
    );
    if (searchHistory) {
      searchHistory.name = payload.name || searchHistory.name;
      await searchHistory.save();
      return successResponse(200, 'SearchHistory Updated', searchHistory);
    } else {
      return errorResponse(404, 'SearchHistory not found');
    }
  }

  async getAll() {
    const searchHistorys = await this.goalModel.find({});
    if (searchHistorys) {
      return successResponse(200, 'SearchHistory', searchHistorys);
    } else {
      return errorResponse(404, 'SearchHistory not found');
    }
  }
}
