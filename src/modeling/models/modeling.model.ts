import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MSchema} from 'mongoose';
import * as mongoose from "mongoose";
import {Provider, UserTypesEnum} from "../../enums/user.enum";
import {
    ApprovalStatus, AssetType,
    DefaultUnit,
    ModelBodySizeEnum,
    ModelHeightEnum,
    ModelWeightEnum,
    OfflineDaysEnumType,
    YesNoEnum
} from "../../enums/modeling.enum";

export type ModelingDocument = Modeling & Document;

export const ModelSizeType = {
    unit: {type: String, enum: ModelBodySizeEnum, default: ModelBodySizeEnum.CM},
    value: {type: Number, default: -1}
};


export const WorkTypeLookingForType = {
    key: {type: String, default: ""},
    value: {type: Boolean, default: false}
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

@Schema()
export class Modeling {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    userId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'model-stats'})
    statId;


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'votes'})
    voteId;


    @Prop({type: String, default: ""})
    selected_category;


    @Prop({
        type: {
            hide: {type: Boolean, default: false},
            value: {type: Date, default: Date.now}
        },
        default: {},
    })
    birth_date;

    @Prop({type: String, default: ""})
    current_city;

    @Prop({type: String, default: ""})
    first_name;

    @Prop({type: String, default: ""})
    last_name;


    @Prop({
        type: {
            unit: {type: String, enum: ModelHeightEnum, default: ModelHeightEnum.CM},
            value: {type: Number, default: -1}
        },
        default: {},
    })
    height;


    @Prop({
        type: {
            unit: {type: String, enum: ModelWeightEnum, default: ModelWeightEnum.KG},
            value: {type: Number, default: -1}
        },
        default: {},
    })
    weight;


    @Prop({type: [String], default: []})
    languages_spoken;


    @Prop({type: String, default: ""})
    race;

    @Prop({
        type: {
            hair_color: {type: String, default: ""},
            eye_color: {type: String, default: ""},
            skin_color: {type: String, default: ""}

        },
        default: {},
    })
    color;


    @Prop({
        type: {
            dress: {type: String, default: ""},
            pants: {type: ModelSizeType},
            jeans: {type: ModelSizeType},
            bra: {type: ModelSizeType},
            bust: {type: ModelSizeType},
            chest: {type: ModelSizeType},
            waist: {type: ModelSizeType},
            hips: {type: ModelSizeType},
            shoes: {type: ModelSizeType},
            shirt: {type: String, default: ""},
            t_shirt: {type: String, default: ""},
        },
        default: {},
    })
    size;

    @Prop({type: String, enum: YesNoEnum, default: YesNoEnum.NO})
    piercing;

    @Prop({type: String, enum: YesNoEnum, default: YesNoEnum.NO})
    tattoos;

    @Prop({type: String, default: ""})
    piercing_tattoos_description;


    @Prop({
        type: [WorkTypeLookingForType],
        default: [],
    })
    work_type_looking_for;


    @Prop({type: String, default: ""})
    comments;


    @Prop({
        type: {
            photographic: {type: String, default: ""},
            film: {type: String, default: ""},
            other: {type: String, default: ""}

        },
        default: {},
    })
    past_experience;


    @Prop({
        type: {
            what_makes_you_unique: {type: String, default: ""},
            why_choose_modeling: {type: String, default: ""},
            favourite_childhood_memory: {type: String, default: ""},
            aspire_to_meet: {type: String, default: ""},
            favourite_role_model: {type: String, default: ""},
            your_strengths: {type: String, default: ""},
            favourite_animal: {type: String, default: ""},
            give_up_to_choose_modeling: {type: String, default: ""},
            favourite_movie: {type: String, default: ""},
            like_to_live: {type: String, default: ""},
            favourite_dish: {type: String, default: ""},

        },
        default: {},
    })
    questionnaires;


    @Prop({type: Number, default: 0})
    rating;


    @Prop({type: String, default: ""})
    fashion_work;


    @Prop({type: Boolean, default: false})
    is_advance_filter_fee_paid;


    @Prop({type: Number, default: 0})
    age;


    @Prop({
        type: [{
            hide: {type: Boolean, default: false},
            asset: {type: String, default: ""},
            for_sale: {type: Boolean, default: false},
            type: {type: String, enum: AssetType, default: AssetType.IMAGE},

            can_contact_directly: {type: Boolean, default: false},
            single_use: {
                type: {
                    value: {type: Number, default: false},
                    selected:{type:Boolean,default:false}
                }
            },
            unlimited_use_country: {
                type: {
                    value: {type: Number, default: false},
                    selected:{type:Boolean,default:false}
                }
            },
            unlimited_use_global: {
                type: {
                    value: {type: Number, default: false},
                    selected:{type:Boolean,default:false}
                }
            },

        }],
        default: [],
    })
    portfolio;


    @Prop({type: String, default: ""})
    gender;


    @Prop({type: [String], default: []})
    pitch_video;

    @Prop({type: String, default: ""})
    profile_image;

    @Prop({type: String, default: ""})
    cover_photo;


    @Prop({
        type: Location,
    })
    location;

    @Prop({type: String, default: ''})
    country;

    @Prop({type: String, default: ''})
    city;


    @Prop({
        type: [{
            result_count: {type: Number, default: 0},
            query: {type: String, default: ""},
            title: {type: String, default: ""}
        }],
        default: [],
    })
    saved_searches;


    @Prop({type: String, enum: DefaultUnit, default: DefaultUnit.IMPERIAL})
    default_unit;


    @Prop({
        type: {
            days: {type: String, enum: OfflineDaysEnumType, default: OfflineDaysEnumType.ONE},
            date_from: {type: Date, default: Date.now},
        },
        default: {},
    })
    offline;


    @Prop({
        type: {
            casual_rate: {type: Number, default: 0},
            half_day: {type: Number, default: 0},
            full_day: {type: Number, default: 0},
            weekly: {type: Number, default: 0},
            additional_pictures: {type: Number, default: 0},
            additional_videos: {type: Number, default: 0},
            makeup_allowance: {type: Number, default: 0},
            clothing_allowance: {type: Number, default: 0},
            travel_allowance: {type: Number, default: 0},
            catalogue_rights: {type: Boolean, default: false},
            country_rights: {type: Boolean, default: false},
            global_rights: {type: Boolean, default: false},
            cancellation_fees: {type: Number, default: false},
            accept_custom_offers: {type: Boolean, default: false},
            custom_offers: {
                type: [{
                    pricing_model: {type: String, default: ''},
                    countries: {type: [String], default: []},
                    price: {type: Number, default: ''},
                    members:[{type: mongoose.Schema.Types.ObjectId, ref: 'users',default:[]}]

                }], default: []
            },

        },
        default: {},
    })
    fees_rights;


    @Prop({type: String, enum: ApprovalStatus, default: ApprovalStatus.PENDING})
    approval_status;


    @Prop({type: Date, default: Date.now})
    date_created;


}

export const ModelingSchema =
    SchemaFactory.createForClass(Modeling);
