import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Block} from "../../enums/user.enum";

export type PostsDocument = Posts & Document;


export const MyList = {
    type: {
        type:String
    },
    selected:{
      type:Boolean
    },
    members: Number
};

@Schema()
export class Posts {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    userId;

    @Prop({type: String, default: ''})
    add_caption;

    @Prop({type: Boolean, default: true})
    allow_comments;

    @Prop({
        type: {
            author_name: {type: String, default: ''},
            description: {type: String, default: ''},
        },
        default: {author_name: '', description: ''},
    })
    music;

    @Prop({
        type: [
            {
                product_name: String,
                affiliate_link: String,
            },
        ],
        default: [],
    })
    tag_products;

    @Prop({
        type: [
            {
                image_url: {
                    type: String,
                    default: '',
                },
                image_text: {
                    type: String,
                    default: '',
                },
                reviews: [
                    {
                        product_name: {
                            type: String,
                            default: '',
                        },
                        number_of_likes: {type: Number, default: 0},
                        who_likes: {
                            type: [mongoose.Schema.Types.ObjectId],
                            ref: 'users',
                            default: [],
                        },
                        number_of_disLikes: {type: Number, default: 0},
                        who_dislikes: {
                            type: [mongoose.Schema.Types.ObjectId],
                            ref: 'users',
                            default: [],
                        },
                    },
                ],
            },
        ],
        default: [],
    })
    post_images;

    @Prop({
        type: [
            {
                video_url: {
                    type: String,
                    default: '',
                },
                video_text: {
                    type: String,
                    default: '',
                },
                reviews: [
                    {
                        product_name: {
                            type: String,
                            default: '',
                        },
                        number_of_likes: {type: Number, default: 0},
                        who_likes: {
                            type: [mongoose.Schema.Types.ObjectId],
                            ref: 'users',
                            default: [],
                        },
                        number_of_disLikes: {type: Number, default: 0},
                        who_dislikes: {
                            type: [mongoose.Schema.Types.ObjectId],
                            ref: 'users',
                            default: [],
                        },
                    },
                ],
            },
        ],
        default: [],
    })
    post_videos;

    @Prop({
        type: [],
        default: [],
    })
    whoLikes;

    @Prop({type: Number, default: 0})
    numberOfLikes;

    @Prop({
        type: [],
        default: [],
    })
    whoDisLikes;

    @Prop({type: Number, default: 0})
    numberOfDisLikes;

    @Prop({type: Number, default: 0})
    number_of_Comments;


    @Prop({
        type: {
            my_list:[MyList],
            hide_members_from: [
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
            ],

            other: {
                local: {
                    type:Boolean
                },
                cities_countries: {
                    type:Boolean
                },
                global: {
                    type:Boolean
                },
                radius: {
                    lat: {
                        type:Number
                    },
                    lng: {
                        type:Number
                    },
                    address: {
                        type:String
                    },
                    miles: {
                        type:Number
                    }
                }
            }
        },
        default: {},
    })
    privacy;


    @Prop({type: String, enum: Block, default: Block.UNBLOCKED})
    blocked;

    @Prop({type: Date, default: Date.now})
    timestamp;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
