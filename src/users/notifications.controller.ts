import {Body, Controller, Put,} from '@nestjs/common';
import {NotificationsService} from "./notifications.service";
import {UpdateNotificationSetting} from "./dtos/notifications.dto";

@Controller('users')
// @Serialize(UserDto)
export class NotificationsController {
  constructor(
    private notificationService: NotificationsService,
  ) {}



  @Put('/notification')
  async updateUserNotification(@Body() payload: UpdateNotificationSetting) {
    const notification=await this.notificationService.updateUserNotificationSetting(payload);
    return notification;
  }

}
