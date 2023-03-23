import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { BankNameDocument } from './models/bank-name.model';

@Injectable()
export class BankNameService {
  constructor(
    @InjectModel('banknames')
    private readonly bankNameModel: Model<BankNameDocument>,
  ) {}

  async create(name: string) {
    const newBankName = new this.bankNameModel({ name });
    const saveBankName = await newBankName.save();
    return successResponse(200, 'Bank Name created', saveBankName);
  }

  async getAll() {
    const bankNames = await this.bankNameModel.find({});
    if (bankNames) {
      return successResponse(200, 'Bank Names', bankNames);
    } else {
      return errorResponse(404, 'Bank Name not found');
    }
  }
}
