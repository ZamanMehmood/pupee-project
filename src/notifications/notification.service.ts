import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {UserDocument} from "../users/models/users.model";
import {NotificationDocument} from "./models/notification.model";
import {NotificationType} from "../modeling/type";
import {CreateNotificationDto, DeleteMultiple} from "./dtos/notification.dto";
import {ModelingGateway} from "../modeling/modeling.gateway";
import {WeddingDocument} from "../wedding/models/wedding.model";
import {NotificationTypeEnum} from "../enums/notification.enum";


@Injectable()
export class NotificationService {
    constructor(
        @InjectModel('notifications') private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel('wedding') private readonly weddingModel: Model<WeddingDocument>,
        private readonly modelingGateway: ModelingGateway
    ) {
    }


    post = async (payload: CreateNotificationDto) => {
        const notification: any = new this.notificationModel(payload);
        if(payload.type===NotificationTypeEnum.WEDDING){
            const validateNotification=await this.checkSyncWeddingExist(payload.user_id,payload.data)
            if(validateNotification){
                return errorResponse(400, 'Request already sent');
            }else{
                const saveNotification=await notification.save();
                return saveNotification;
            }

        }else{
            const saveNotification=await notification.save();
            return saveNotification;
        }
    };


    add = async (payload: NotificationType) => {
        const notification: any = new this.notificationModel(payload);
        this.modelingGateway.server.emit("notification"+(payload.user_id).toString(),payload);
        await notification.save();
        return;
    };


    getById = async (id: string) => {
        const notifications = await this.notificationModel.find({user_id:new mongoose.Types.ObjectId(id)});
        return successResponse(200, 'notification', notifications);
    };


    getNotificationByStatus = async (id: string,status:boolean) => {
        const notifications = await this.notificationModel.find({user_id:new mongoose.Types.ObjectId(id),is_read:status});
        return successResponse(200, 'notification', notifications);
    };

    updateNotificationStatusAll = async (id: string) => {
        const notifications = await this.notificationModel.updateMany({user_id:new mongoose.Types.ObjectId(id),is_read:false},{is_read:true});
        return successResponse(200, 'notification', notifications);
    };

    deleteMultipleNotification = async (payload: DeleteMultiple) => {
        const notifications = await this.notificationModel.deleteMany({_id: { $in: payload.id}});
        return successResponse(200, 'notification deleted', notifications);
    };


    checkSyncWeddingExist=async(userId:string,weddingId:string)=>{
        const notifications = await this.notificationModel.find({user_id:new mongoose.Types.ObjectId(userId),
            type:"wedding",data:weddingId});
        return notifications && notifications.length>0;
    }


    validateWeddingNotificationStatus=async (userId:string,weddingId:string)=>{
        const checkIfExist=await this.checkSyncWeddingExist(userId,JSON.stringify({weddingId}));
        return {isRequestAlreadySent:checkIfExist};
    }

}
