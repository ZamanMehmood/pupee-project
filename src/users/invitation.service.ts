import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {UpdateNotificationSetting} from './dtos/notifications.dto';
import {UserDocument} from "./models/users.model";
import {CreateInvitation, GetInvitation} from "./dtos/invitation.dto";
import {InvitationDocument} from "./models/invite-notification.model";
import {NotificationService} from "../notifications/notification.service";
import {NotificationType} from "../modeling/type";
import {NotificationTypeEnum} from "../enums/notification.enum";
import {getNotificationMessage} from "../utils/notification";

@Injectable()
export class InvitationService {
    constructor(
        @InjectModel('invitations') private readonly invitationModel: Model<InvitationDocument>,
        private notificationService: NotificationService
    ) {
    }

    async add(payload: CreateInvitation) {
        let invitation = new this.invitationModel(payload);
        const saveInvitation = await invitation.save();
        return successResponse(200, 'invitation added', saveInvitation);
    }


    async getInvitationByKey(payload: GetInvitation) {
        let invitation = await this.invitationModel.find({key: {$in: payload.key}});
        return successResponse(200, 'invitation', invitation);
    }


    async getInvitationByEmailPhone(key: string) {
        let invitation = await this.invitationModel.find({key: {$in: [key]}});
        return invitation;
    }


    async handleInvitation(key: string, user: any) {
        const invitationList: any = await this.getInvitationByEmailPhone(key);
        for (let i = 0; i < invitationList.length; i++) {
            const invitation = invitationList[i];
            const notification: NotificationType = {
                user_id: invitation.userInfo.id, type: NotificationTypeEnum.INVITATION_ACCEPTED,
                message: getNotificationMessage(NotificationTypeEnum.INVITATION_ACCEPTED, user.first_name, user.last_name),
                data: JSON.stringify({phone_number: user.phone_number}),
                profile_info: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image_url: user.profile_image_url
                }
            };
            await this.notificationService.add(notification)
        }
    }

}
