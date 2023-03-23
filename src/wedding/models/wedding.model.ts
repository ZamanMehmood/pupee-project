import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";

export type WeddingDocument = Wedding & Document;

@Schema()
export class Wedding {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    userId;





    @Prop({
        type: {
            id: {type: mongoose.Schema.Types.ObjectId},
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
            timestamp: {type: Date, default: Date.now},
        },
        default: {},
    })
    partner;

    @Prop({
        type: {
            id: {type: mongoose.Schema.Types.ObjectId},
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            profile_image_url: {type: String, default: ''},
            timestamp: {type: Date, default: Date.now},
        },
        default: {},
    })
    profile;


    @Prop({type: Date, default: Date.now})
    date;

    @Prop({
        type: {
            lat: {type: Number, default: 0},
            lng: {type: Number, default: 0},
        },
        default: {},
    })
    location;


    @Prop({type: String})
    description;

    @Prop({type: String})
    number_of_guests;

    @Prop({type: String})
    budget;

    @Prop({type: String})
    country;


    @Prop({type: String,default:""})
    title;


    @Prop({type: String})
    state;


    @Prop({type: String})
    city;

    @Prop({type: String})
    venue_name;

    @Prop({type: String})
    address;

    @Prop({type: String})
    vows;

    @Prop({
        type: [{
            relation: {
                label: {type: String, default: ''},
                value: {type: String, default: ''},
            },
            first_name: {type: String, default: ''},
            last_name: {type: String, default: ''},
            phone_number: {type: String, default: ''},
            email: {type: String, default: ''},
        }],
        default: [],
    })
    recipient;


    @Prop({type: String,default:""})
    announcement;

    @Prop({type: Date, default: Date.now})
    engagement_date ;

    @Prop({type: String,default:""})
    wedding_date;

    @Prop({type: String,default:""})
    wedding_time ;

    @Prop({type: String,default:""})
    ceremony_location;

    @Prop({type: String,default:""})
    ceremony_address ;

    @Prop({type: String,default:""})
    ceremony_location_google;

    @Prop({type: String,default:""})
    reception_venue_name ;

    @Prop({type: String,default:""})
    reception_venue_address;

    @Prop({type: String,default:""})
    reception_venue_google ;



    @Prop({
        type: {
            when: {
                1: {
                    label: {type: String, default: ''},
                    value: {type: Boolean, default: false},
                },
                2: {
                    label: {type: String, default: ''},
                    value: {type: Boolean, default: false},
                },
                3: {
                    label: {type: String, default: ''},
                    value: {type: Boolean, default: false},
                },
            },
            who: {
                me: {type: Boolean, default: false},
                my_wife_husband: {type: Boolean, default: false},
            }
        },
        default: {
            when: {
                1: {label:'',value:false},
                2: {label:'',value:false},
                3: {label:'',value:false}
            },
            who: {
                me: false,
                my_wife_husband: false,
            }
        },
    })
    anniversary_reminder;


    @Prop({
        type: [{
            title: {type: String, default: ''},
            booked: {type: Boolean, default: false},
        }],
        default: [],
    })
    checkList;
}

export const WeddingSchema =
    SchemaFactory.createForClass(Wedding);
