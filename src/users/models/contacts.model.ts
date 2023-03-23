import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Block, Role} from "../../enums/user.enum";
import * as mongoose from "mongoose";

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    user_id;


    @Prop({
        type: [{
            userInfo: {
                first_name: {type: String, default: ''},
                last_name: {type: String, default: ''},
                profile_image_url: {type: String, default: ''},
                group_name: {type: String, default: ''},
                group_logo: {type: String, default: ''},

            },
            id:{type:String,default:''},
            count: {type: Number, default: 0},
            last_message: {type: String, default: ''},
            updated_at:{type: Date, default: Date.now}
        }],
        default: []
    })
    list;




    @Prop({type: Date, default: Date.now})
    updated_at;

}

export const ContactSchema = SchemaFactory.createForClass(Contact);
