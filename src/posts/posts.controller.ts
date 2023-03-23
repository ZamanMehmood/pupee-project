import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import {
    CreateCommentDto,
    DeleteCommentDto,
    LikeCommentDto,
    UpdateCommentDto,
} from './dtos/comments.dto';
import {
    CreatePostDto,
    DeletePostDto,
    DisLikePostDto,
    DisLikeSinglePostImageDto,
    DisLikeSinglePostVideoDto,
    LikePostDto,
    LikeSinglePostImageDto,
    LikeSinglePostVideoDto, UpdateMultiplePostsDto,
    UpdatePostDto,
} from './dtos/posts.dto';
import {
    CreateReviewDto,
    LikeReviewDto,
    UpdateReviewDto,
} from './dtos/reviews.dto';
import {
    CreateSubCommentDto,
    DeleteSubCommentDto,
    UpdateSubCommentDto,
} from './dtos/subComments.dto';
import {PostsService} from './posts.service';
import mongoose from 'mongoose';
import {errorResponse} from '../utils/response';
import {CreatePrivacyPolicyDto} from "./dtos/privacy.dto";
import {UpdateMultipleUsersDto} from "../users/dtos/create-user-profile.dto";
import {SearchAndFilterDto} from "../users/dtos/search-and-filter.dto";

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {
    }

    // Post apis
    @Post('/')
    async createPost(@Body() body: CreatePostDto) {
        const post = await this.postService.createPost(body);
        return post;
    }

    @Put('/')
    async updatePost(@Body() body: UpdatePostDto) {
        const post = await this.postService.updatePost(body);
        return post;
    }

    @Delete('/')
    async deletePost(@Body() body: DeletePostDto) {
        const post = await this.postService.deletePost(body.postId);
        return post;
    }

    @Get('/reviews')
    async getAllReviews() {
        const reviews = await this.postService.getAllReviews();
        return reviews;
    }

    @Get('/all')
    async getAllPosts(@Param('id') id: String) {
        const posts = await this.postService.getAllPosts();
        return posts;
    }

    @Get('/all/:id')
    async getAllPostsWithUserLikes(@Param('id') id: String) {
        const posts = await this.postService.getAllPostsWithUserLikes(id);
        return posts;
    }


    @Get('/:id')
    async getPostById(@Param('id') id: String) {
        const posts = await this.postService.getPostById(id);
        return posts;
    }

    @Get('/user/:id')
    async getPostsByUserId(@Param('id') id: String) {
        let checkUserId = mongoose.isValidObjectId(id);
        if (!checkUserId) {
            return errorResponse(500, 'userId is not a valid id');
        }
        const posts = await this.postService.getPostsByUserId(id);
        return posts;
    }

    @Post('/like')
    async likePost(@Body() body: LikePostDto) {
        const postLikeResponse = await this.postService.postLike(body);
        return postLikeResponse;
    }

    @Post('/likesinglepostimage')
    async likeSingePostImage(@Body() body: LikeSinglePostImageDto) {
        const postLikeResponse = await this.postService.postSingleImageLike(body);
        return postLikeResponse;
    }

    @Post('/likesinglepostvideo')
    async likeSingePostVideo(@Body() body: LikeSinglePostVideoDto) {
        const postLikeResponse = await this.postService.postSingleVideoLike(body);
        return postLikeResponse;
    }

    @Post('/dislike')
    async disLikePost(@Body() body: DisLikePostDto) {
        const postDisLikeResponse = await this.postService.postDisLike(body);
        return postDisLikeResponse;
    }

    @Post('/dislikesinglepostimage')
    async disLikeSinglePostImage(@Body() body: DisLikeSinglePostImageDto) {
        const postDisLikeResponse = await this.postService.postSingleImageDisLike(
            body,
        );
        return postDisLikeResponse;
    }

    @Post('/dislikesinglepostvideo')
    async disLikeSinglePostVideo(@Body() body: DisLikeSinglePostVideoDto) {
        const postDisLikeResponse = await this.postService.postSingleVideoDisLike(
            body,
        );
        return postDisLikeResponse;
    }

    // Comment apis
    @Post('/comments')
    async createComment(@Body() body: CreateCommentDto) {
        const comment = await this.postService.createComment(body);
        return comment;
    }

    @Put('/comments')
    async updateComment(@Body() body: UpdateCommentDto) {
        const comment = await this.postService.updateComment(body);
        return comment;
    }

    @Get('/comments/post/:id')
    async getCommentsByPostId(@Param('id') id: string) {
        const comments = await this.postService.getCommentsByPostId(id);
        return comments;
    }

    @Get('/comments')
    async getAllComments() {
        const comments = await this.postService.getAllComments();
        return comments;
    }

    @Delete('/comments')
    async deleteComment(@Body() body: DeleteCommentDto) {
        const comment = await this.postService.deleteComment(body.commentId);
        return comment;
    }

    @Post('/comments/like')
    async likeComment(@Body() body: LikeCommentDto) {
        const comment = await this.postService.commentLike(body);
        return comment;
    }

    // Sub Comment apis
    @Post('/comments/subcomments')
    async createSubComment(@Body() body: CreateSubCommentDto) {
        const subComment = await this.postService.createSubComment(body);
        return subComment;
    }

    @Put('/comments/subcomments')
    async updateSubComment(@Body() body: UpdateSubCommentDto) {
        const subComment = await this.postService.updateSubComment(body);
        return subComment;
    }

    @Get('/comments/subcomments')
    async getAllSubComments() {
        const subComments = await this.postService.getAllSubComments();
        return subComments;
    }

    @Delete('/comments/subcomments')
    async deleteSubComment(@Body() body: DeleteSubCommentDto) {
        const subComment = await this.postService.deleteSubComment(
            body.sub_comment_id,
        );
        return subComment;
    }

    // Reviews Apis
    @Post('/reviews')
    async createReview(@Body() body: CreateReviewDto) {
        const review = await this.postService.createReview(body);
        return review;
    }

    @Put('/reviews/update')
    async updateReview(@Body() body: UpdateReviewDto) {
        const review = await this.postService.updateReview(body);
        return review;
    }

    @Post('/reviews/like')
    async likeReview(@Body() body: LikeReviewDto) {
        const likeReview = await this.postService.likeReview(body);
        return likeReview;
    }

    @Post('/reviews/dislike')
    async disLikeReview(@Body() body: LikeReviewDto) {
        const disLikeReview = await this.postService.disLikeReview(body);
        return disLikeReview;
    }

    @Get('/reviews/post/:id')
    async getPostReviews(@Param('id') id: string) {
        const reviews = await this.postService.getPostReviews(id);
        return reviews;
    }

    @Get('/reviews/:id')
    async getReviewById(@Param('id') id: string) {
        const review = await this.postService.getReviewById(id);
        return review;
    }


    @Put('/:id/privacy')
    async updatePostPrivacy(@Param('id') id: string, @Body() body: CreatePrivacyPolicyDto) {
        const postPrivacy = await this.postService.updatePostPrivacy(id, body);
        return postPrivacy;
    }


    @Put('/multiple')
    async updateMultiplePosts(@Body() body: UpdateMultiplePostsDto) {
        const post = await this.postService.updateMultiplePosts(body);
        return post;
    }


    @Post('/search')
    async searchByAnyField(@Body() body: SearchAndFilterDto) {
        const post = await this.postService.searchByField(body);
        return post;
    }


}
