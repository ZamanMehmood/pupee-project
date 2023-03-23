import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import {
  CreateWithdrawMethodDto,
  UpdateWithdrawMethodDefaultDto,
  UpdateWithdrawMethodDto,
} from './dtos/withdraw-method.dto';
import { WithdrawMethodDocument } from './models/withdraw-method.model';

@Injectable()
export class WithdrawMethodService {
  constructor(
    @InjectModel('withdrawmethods')
    private readonly withdrawMethodModel: Model<WithdrawMethodDocument>,
  ) {}

  async create(payload: CreateWithdrawMethodDto) {
    const newWithDraw = new this.withdrawMethodModel(payload);
    const saveWithDraw = await newWithDraw.save();
    return successResponse(200, 'Withdraw Method created', saveWithDraw);
  }

  async update(payload: UpdateWithdrawMethodDto) {
    let withdrawMethod = await this.withdrawMethodModel.findById(
      payload.withdraw_method_id,
    );
    if (!withdrawMethod) {
      return errorResponse(404, 'Withdraw Method not found');
    }
    withdrawMethod.bank_name = payload.bank_name || withdrawMethod.bank_name;
    withdrawMethod.account_number =
      payload.account_number || withdrawMethod.account_number;
    await withdrawMethod.save();
    return successResponse(200, 'Withdraw method updated', withdrawMethod);
  }

  async updateDefaultMethod(payload: UpdateWithdrawMethodDefaultDto) {
    const findMethods = await this.withdrawMethodModel.find({
      user_id: payload.user_id,
    });
    if (findMethods && findMethods.length > 0) {
      let methods = [];
      findMethods.map(async (data) => {
        if (data._id == payload.withdraw_method_id) {
          data.is_default_method = true;
        } else {
          data.is_default_method = false;
        }
        methods.push(data);
        await data.save();
      });
      return successResponse(200, 'Default Method updated', methods);
    } else {
      return errorResponse(404, 'Withdraw Method not found');
    }
  }

  async getByUserId(id: string) {
    const methods = await this.withdrawMethodModel.find({ user_id: id });

    if (!methods) {
      return errorResponse(404, 'Withdraw Method not found');
    }

    return successResponse(200, 'Withdraw Methods', methods);
  }

  async getById(id: string) {
    const methods = await this.withdrawMethodModel.findById(id);

    if (!methods) {
      return errorResponse(404, 'Withdraw Method not found');
    }

    return successResponse(200, 'Withdraw Method', methods);
  }

  async getAll() {
    const methods = await this.withdrawMethodModel.find({});

    if (!methods) {
      return errorResponse(404, 'Withdraw Method not found');
    }

    return successResponse(200, 'Withdraw Methods', methods);
  }
}
