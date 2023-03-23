import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";

export type PlaylistDocument = Playlist & Document;

@Schema()
export class Playlist {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'wedding'})
    weddingId;


    @Prop({
        type: [{
            name: {type: String, default: ''},
            songs: [{
                title: {type: String, default: ''},
                sub_title:{type:String,default:''},
                duration:{type:Number,default:''},
                url:{type:String,default:''}
            }],
        }],
        default: [],
    })
    event;

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
}

export const PlaylistSchema =
    SchemaFactory.createForClass(Playlist);
