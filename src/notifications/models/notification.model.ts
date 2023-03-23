import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Provider} from "../../enums/user.enum";
import {NotificationTypeEnum} from "../../enums/notification.enum";

export type NotificationDocument = NotificationModel & Document;


@Schema()
export class NotificationModel {


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null})
    user_id;


    @Prop({type: String, enum: NotificationTypeEnum, default: NotificationTypeEnum.DEFAULT})
    type;

    @Prop({type: String, default:""})
    message;

    @Prop({type: String, default:""})
    data;


    @Prop({type: Boolean, default:false})
    is_read;


    @Prop({type: Date, default: Date.now})
    date_created;

    @Prop({
        type: {
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
            timestamp: {type: Date, default: Date.now},
        },
        default: {},
    })
    profile_info;
}

export const NotificationSchema =
    SchemaFactory.createForClass(NotificationModel);
