import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {UserTypesEnum} from "../../enums/user.enum";
import {WeddingServicesType} from "../../enums/wedding.enum";

export type WeddingAlbumDocument = WeddingAlbum & Document;

@Schema()
export class WeddingAlbum {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'wedding' })
    weddingId;

    @Prop({
        type: [{
            type: {type: String, default: ''},
            asset: {type: String, default: ''},
        }],
        default: [],
    })
    album;

    @Prop({
        type: [{
            userId: {type: mongoose.Schema.Types.ObjectId},
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
            can_edit: {type: Boolean, default: false},
            timestamp: {type: Date, default: Date.now},
        }],
        default: [],
    })
    shared_with;

    @Prop({type: String})
    title;


}

export const WeddingAlbumSchema =
    SchemaFactory.createForClass(WeddingAlbum);
