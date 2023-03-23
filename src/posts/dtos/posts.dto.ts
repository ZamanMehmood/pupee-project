import {
    ArrayMinSize,
    IsArray,
    IsBoolean, IsEnum,
    IsNotEmpty, IsNumber,
    IsObject,
    IsOptional,
    IsString, ValidateNested,
} from 'class-validator';
import {Block} from "../../enums/user.enum";
import {Type} from "class-transformer";
import {CreateUserProfileDto} from "../../users/dtos/create-user-profile.dto";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    add_caption: string;



    @IsArray()
    @IsOptional()
    post_images: [];

    @IsArray()
    @IsOptional()
    post_videos: [];

    @IsArray()
    @IsOptional()
    tag_products: [
        {
            product_name: string;
            affiliate_link: string;
        }
        ];

    @IsBoolean()
    @IsNotEmpty()
    allow_comments;

    @IsArray()
    @IsOptional()
    ask_for_reviews: [string];

    @IsObject()
    @IsOptional()
    music: { author_name: string; description: string };
}

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsOptional()
    add_caption: string;

    @IsArray()
    @IsOptional()
    post_images: [string];

    @IsArray()
    @IsOptional()
    post_videos: [string];

    @IsOptional()
    @IsEnum(Block)
    blocked;
}

export class DeletePostDto {
    @IsString()
    @IsNotEmpty()
    postId: string;
}

export class LikePostDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class DisLikePostDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class LikeSinglePostImageDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    postImageId: string;

    @IsString()
    @IsNotEmpty()
    reviewItemName: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class LikeSinglePostVideoDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    postVideoId: string;

    @IsString()
    @IsNotEmpty()
    reviewItemName: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class DisLikeSinglePostImageDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    postImageId: string;

    @IsString()
    @IsNotEmpty()
    reviewItemName: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class DisLikeSinglePostVideoDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    postVideoId: string;

    @IsString()
    @IsNotEmpty()
    reviewItemName: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}


export class UpdateMultiplePostsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => UpdatePostDto)
    posts;
}