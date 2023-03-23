import {NotificationTypeEnum} from "../enums/notification.enum";


const getNotificationMessage=(type:NotificationTypeEnum,firstName:string,lastName)=>{
    const fullName=`${firstName} ${lastName}`
    if(type===NotificationTypeEnum.POST_LIKE){
        return `${fullName} liked your post`
    }else if(type===NotificationTypeEnum.POST_COMMENT){
        return `${fullName} commented on your post`
    }else if(type===NotificationTypeEnum.ORDER_RECEIVED){
        return `${fullName} created new order.`
    }else if(type===NotificationTypeEnum.ORDER_CANCELED){
        return `${fullName} canceled the order.`
    }else if(type===NotificationTypeEnum.INVITATION_ACCEPTED){
        return `${fullName} accepter your invitation.`
    }else if(type===NotificationTypeEnum.DEFAULT){
        return `${fullName} default message.`
    }
    return "";
}

export {getNotificationMessage}