import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document, Schema as MSchema} from 'mongoose';
import {Block, Provider, StorageEnum, UserTypesEnum} from '../../enums/user.enum';

export const PaymentMethodType = {
    card_holder_name: String,
    card_number: String,
    expiry: String,
    cvv: String,
};


export const NotificationSettingType = {
    enable_notification: Boolean,
    new_post_to_review: Boolean,
    new_comments: Boolean,
    new_likes: Boolean,
    new_reviews: Boolean,
    new_messages: Boolean,
    app_update: Boolean,
    automatic_update: Boolean,
    automatically_add_new_contact: Boolean,

};


export const Location = new mongoose.Schema({
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});


export const MyList = {
    type: {
        type: String
    },
    members: [
        {
            userId: {
                type: String,
            },
            first_name: {
                type: String
            },
            last_name: {
                type: String
            },
            user_name: {
                type: String
            },
            profile_image_url: {
                type: String
            }
        }
    ]
};


export const QualificationsOrDegreeType = {
    image_url: String,
    institute_name: String,
    degree_title: String,
    year: String,
};

export const CertificatesType = {
    image_url: String,
    certificate_name: String,
    year: String,
};

export const DrivingLicense = {
    front_image_url: String,
    back_image_url: String,
};

export const OtherDocument = [{
    image_url: String,
    document_name: String,
}];


export type UserDocument = Users & Document;

@Schema()
export class Users {
    @Prop({type: String})
    email;

    @Prop({type: String})
    password;

    @Prop({type: String, default: ''})
    phone_number;

    @Prop({type: Boolean, default: false})
    is_phone_number_verified;

    @Prop({type: String, default: ''})
    country;

    @Prop({type: String, default: ''})
    city;

    @Prop({type: String, default: ''})
    gender;

    @Prop({type: String, default: ''})
    birth_day;

    @Prop({type: String, default: ''})
    verification_code;

    @Prop({type: Boolean, default: false})
    is_email_verified;

    @Prop({type: String, default: ''})
    occupation;

    @Prop({type: String, default: ''})
    main_language;

    @Prop({type: String, default: ''})
    profile_image_url;

    @Prop({type: String, default: ''})
    patch_video_url;

    @Prop({type: String, default: ''})
    first_name;

    @Prop({type: String, default: ''})
    last_name;

    @Prop({type: [String], default: []})
    past_work_images;

    @Prop({type: [String], default: []})
    interests;

    @Prop({type: String, enum: UserTypesEnum, default: UserTypesEnum.USER})
    user_type;

    @Prop({type: String, default: ''})
    passport_image;

    @Prop({type: OtherDocument, default: []})
    other_document;

    @Prop({
        type: DrivingLicense,
        default: {front_image_url: '', back_image_url: ''},
    })
    driving_license;

    @Prop({
        type: PaymentMethodType,
        default: {
            card_holder_name: '',
            card_number: '',
            expiry: '',
            cvv: '',
        },
    })
    payment_method;

    @Prop({type: [String], default: []})
    seller_affiliate_link;

    @Prop({type: String, default: ''})
    business_title;

    @Prop({type: String, default: ''})
    user_name;

    @Prop({type: String, default: ''})
    service_provider_image;

    @Prop({type: [String], default: []})
    i_am_a;

    @Prop({
        type: [QualificationsOrDegreeType],
        default: [],
    })
    qualifications_or_degree;

    @Prop({
        type: [CertificatesType],
        default: [],
    })
    certificates;

    @Prop({
        type: [{type: MSchema.Types.ObjectId, default: null}],
        ref: 'posts',
        default: [],
    })
    liked_posts;

    @Prop({
        type: [{type: MSchema.Types.ObjectId, default: null}],
        ref: 'posts',
        default: [],
    })
    disliked_posts;

    @Prop({type: Boolean, default: false})
    is_online;

    @Prop({type: String, default: ''})
    state;

    @Prop({type: String, default: ''})
    cover_image;

    @Prop({type: String, default: ''})
    country_code;

    @Prop({type: String, default: ''})
    country_phone_code;

    @Prop({type: String, default: ''})
    seller_stripe_account_id;

    @Prop({type: String, default: ''})
    short_id;

    @Prop({type: String, default: ''})
    stripe_id;


    @Prop({type: Number, default: 0})
    amount_to_pending_clearance;

    @Prop({type: Number, default: 0})
    amount_to_withdrawal;

    @Prop({type: String, default: ''})
    stripe_connected_id;

    @Prop({
        type: NotificationSettingType,
        default: {
            enable_notification: true,
            new_post_to_review: true,
            new_comments: true,
            new_likes: true,
            new_reviews: true,
            new_messages: true,
            app_update: true,
            automatic_update: true,
            automatically_add_new_contact: true,
        },
    })
    notification_setting;


    @Prop({
        type: [MyList],
    })
    my_list;


    @Prop({
        type: Location,
    })
    location;

    @Prop({type: Number, default: 0})
    rating;


    @Prop({type: Number, default: 0})
    reviews_count;


    @Prop({type: String, default: ""})
    rating_id;


    @Prop({
        type: [{
            weddingId: {type: mongoose.Schema.Types.ObjectId, ref: 'wedding'},
            can_edit: {type: Boolean, default: true},
            albumId: {type: mongoose.Schema.Types.ObjectId, ref: 'wedding-albums'},

        }],
        default: []
    })
    shared_albums;

    @Prop({
        type: [{
            weddingId: {type: String, default: ''},
            can_edit: {type: Boolean, default: true},
            orderOfProceedingId: {type: String, default: ''},

        }],
        default: []
    })
    shared_order_of_proceedings;


    @Prop({
        type: [{
            weddingId: {type: mongoose.Schema.Types.ObjectId, ref: 'wedding'},
            can_edit: {type: Boolean, default: true},
            playlistId: {type: mongoose.Schema.Types.ObjectId, ref: 'playlists'},

        }],
        default: []
    })
    shared_playlist;


    @Prop({type: String, enum: Provider, default: Provider.USER})
    provider;


    @Prop({type: String, enum: Block, default: Block.UNBLOCKED})
    blocked;

    @Prop({
        type: [{
            time_slot: {type: String,},
        }],
        default: []
    })
    slots;


    @Prop({
        type: {
            card: {type: String,},
            au_becs_debit: {type: String,},
        },
        default: {
            card: '',
            au_becs_debit: ''
        }
    })
    defaultPaymentMethods;

    @Prop({type: [String], default: []})
    preferences;

    @Prop({type: String, default: ""})
    fcm;

    @Prop({
        type: {
            sync: {type: Boolean,},
            wedding: {type: mongoose.Schema.Types.ObjectId, ref: 'weddings'},
        },
        default: {
            sync: false,
            wedding: null
        }
    })
    wedding_synced;


    @Prop({
        type: [{
            hashtag:{type:String},
            last_searched:{type:Date,default:Date.now}
        }], default: []
    })
    searched_results;


    @Prop({
        type: {
            admin: {type: Number, default: 0},
            user: {type: Number, default: 0}
        }, default: {}
    })
    report_problem_count;

    @Prop({
        type: {
            id: {type: mongoose.Schema.Types.ObjectId, ref: 'storages'},
            plan: {type: String,enum:StorageEnum, default: StorageEnum.MONTHLY}
        }, default: {}
    })
    storage;

    @Prop({type: Date, default: Date.now})
    timestamp;
}

export const UserSchema = SchemaFactory.createForClass(Users);
