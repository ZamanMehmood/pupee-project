import {Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe} from '@nestjs/common';
import {NotificationService} from "./notification.service";
import {CreateNotificationDto, DeleteMultiple} from "./dtos/notification.dto";
import {GetInvitation} from "../users/dtos/invitation.dto";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {
    }





    @Post('/')
    async create(@Body() payload: CreateNotificationDto) {
        const rating = await this.notificationService.post(payload);
        return rating;
    }

    @Put('/user/:id/status/read')
    async updateNotificationStatusAll(@Param('id') id: string) {
        const userPaymentCards = await this.notificationService.updateNotificationStatusAll(id);
        return userPaymentCards;
    }

    @Get('/:id')
    async getById(@Param('id') id: string) {
        const userPaymentCards = await this.notificationService.getById(id);
        return userPaymentCards;
    }


    @Get('/:id/status/:status')
    async getNotificationByStatus(@Param('id') id: string,@Param('status') status: boolean) {
        const userPaymentCards = await this.notificationService.getNotificationByStatus(id,status);
        return userPaymentCards;
    }


    @Delete('/')
    async deleteNotifications(@Query(new ValidationPipe({
                                  transform: true,
                                  transformOptions: {enableImplicitConversion: true},
                                  forbidNonWhitelisted: true
                              })) query: DeleteMultiple
    ) {
        const invitation = await this.notificationService.deleteMultipleNotification(query);
        return invitation;
    }

    @Get('/user/:userId/wedding/:weddingId')
    async validateWeddingNotificationRequest(@Param('userId') userId: string,@Param('weddingId') weddingId: string) {
        const userPaymentCards = await this.notificationService.validateWeddingNotificationStatus(userId,weddingId);
        return userPaymentCards;
    }
}
