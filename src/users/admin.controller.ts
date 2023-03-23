import {Body, Controller, Get, Param, Post, Put,} from '@nestjs/common';
import {NotificationsService} from "./notifications.service";
import {UpdateNotificationSetting} from "./dtos/notifications.dto";
import {UsersService} from "./users.service";
import {CreateAdminDto, UpdateAdminDto, UpdateAdminPasswordDto, ValidateAdminDto} from "./dtos/admin.dto";

@Controller('admin')
// @Serialize(UserDto)
export class AdminController {
  constructor(
      private userService: UsersService,
  ) {}



    @Post('/')
    async addAdmin(@Body() body: CreateAdminDto) {
        const user = await this.userService.createAdminUser(body);
        return user;
    }


    @Put('/validate')
    async validateAdmin(@Body() body: ValidateAdminDto) {
        const user = await this.userService.validateAdminUser(body);
        return user;
    }

    @Get('/:type')
    async getAdminByType(@Param('type') type) {
        const user = await this.userService.getAdminByRole(type);
        return user;
    }




    @Put('/:id')
    async updateAdmin(@Param('id') id,@Body() body: UpdateAdminDto) {
        const user = await this.userService.updateAdminUser(id,body);
        return user;
    }


    @Put('/:id/password')
    async updateAdminPassword(@Param('id') id,@Body() body: UpdateAdminPasswordDto) {
        const user = await this.userService.updateAdminPassword(id,body);
        return user;
    }


}
