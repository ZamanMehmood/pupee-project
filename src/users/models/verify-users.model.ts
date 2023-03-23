import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import {UserTypesEnum} from '../../enums/user.enum';


export type VerifyUserDocument = VerifyUsers & Document;

@Schema()
export class VerifyUsers {
    @Prop({type: String})
    email;

    @Prop({type: String, default: ''})
    verification_code;

    @Prop({type: Boolean, default: false})
    is_email_verified;


    @Prop({type: Date, default: Date.now})
    timestamp;
}

export const VerifyUserSchema = SchemaFactory.createForClass(VerifyUsers);
