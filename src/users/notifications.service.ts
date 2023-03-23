import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateNotificationSetting } from './dtos/notifications.dto';
import {UserDocument} from "./models/users.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async updateUserNotificationSetting(payload: UpdateNotificationSetting) {
    let user = await this.userModel.findById(payload.userId);
    if(!user){
        return successResponse(404, 'User not found',null);
    }
    user.notification_setting=payload.notification_setting;
    await user.save();
    return successResponse(200, 'Notification setting updated', user);
  }


}
