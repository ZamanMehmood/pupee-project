import {Body, Controller, Get, Param, Post, Put, Query, ValidationPipe,} from '@nestjs/common';
import {NotificationsService} from "./notifications.service";
import {UpdateNotificationSetting} from "./dtos/notifications.dto";
import {InvitationService} from "./invitation.service";
import {CreateInvitation, GetInvitation} from "./dtos/invitation.dto";

@Controller('invitation')
// @Serialize(UserDto)
export class InvitationController {
    constructor(
        private invitationService: InvitationService,
    ) {
    }


    @Post('/')
    async add(@Body() payload: CreateInvitation) {
        const invitation = await this.invitationService.add(payload);
        return invitation;
    }


    @Get('/')
    async getInvitationByKeys(@Query(new ValidationPipe({
                                      transform: true,
                                      transformOptions: {enableImplicitConversion: true},
                                      forbidNonWhitelisted: true
                                  })) query: GetInvitation
    ) {
        const invitation = await this.invitationService.getInvitationByKey(query);
        return invitation;
    }

}
