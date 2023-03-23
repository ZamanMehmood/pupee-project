import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Block, Role} from "../../enums/user.enum";

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
    @Prop({ type: String, default: '' })
    username;

    @Prop({ type: String, default: '' })
    password;


    @Prop({ type: String, enum: Role, default: Role.ADMIN })
    role;

    @Prop({type: Date, default: Date.now})
    timestamp;

}

export const AdminSchema = SchemaFactory.createForClass(Admin);
