import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Posts, PostsDocument} from './models/posts.model';
import {CommentsDocument} from './models/comments.model';
import {SubCommentsDocument} from './models/sub-comments.model';
import {Model} from 'mongoose';
import {
    CreatePostDto,
    DisLikePostDto,
    DisLikeSinglePostVideoDto,
    LikePostDto,
    LikeSinglePostImageDto,
    LikeSinglePostVideoDto, UpdateMultiplePostsDto,
    UpdatePostDto,
} from './dtos/posts.dto';
import {
    CreateCommentDto,
    LikeCommentDto,
    UpdateCommentDto,
} from './dtos/comments.dto';
import {
    CreateSubCommentDto,
    UpdateSubCommentDto,
} from './dtos/subComments.dto';
import {errorResponse, successResponse} from '../utils/response';
import {
    CreateReviewDto,
    LikeReviewDto,
    UpdateReviewDto,
} from './dtos/reviews.dto';
import {ReviewsDocument} from './models/reviews.model';
import {UserDocument} from "../users/models/users.model";
import {CreatePrivacyPolicyDto} from "./dtos/privacy.dto";
import {SearchAndFilterDto} from "../users/dtos/search-and-filter.dto";
import {UpdateMultipleUsersDto} from "../users/dtos/create-user-profile.dto";
import {NotificationService} from "../notifications/notification.service";
import {CreateNotificationDto} from "../notifications/dtos/notification.dto";
import {NotificationTypeEnum} from "../enums/notification.enum";
import {getNotificationMessage} from "../utils/notification";
import {NotificationType} from "../modeling/type";
import {HashtagService} from "../hashtags/hashtag.service";
import {getHashtagFromPost} from "../utils/hashtag";

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('posts') private readonly postModel: Model<PostsDocument>,
        @InjectModel('subcomments')
        private readonly subCommentsModel: Model<SubCommentsDocument>,
        @InjectModel('comments')
        private readonly commentsModel: Model<CommentsDocument>,
        @InjectModel('reviews')
        private readonly reviewsModel: Model<ReviewsDocument>,
        @InjectModel('post_likes')
        private readonly postLikesModel: Model<ReviewsDocument>,
        @InjectModel('post_dislikes')
        private readonly postDislikesModel: Model<ReviewsDocument>,
        @InjectModel('users')
        private readonly userModel: Model<UserDocument>,
        private readonly notificationService: NotificationService,
        private hashtagService: HashtagService
    ) {
    }

    // Posts apis
    createPost = async (postDto: CreatePostDto) => {
        const post = new this.postModel(postDto);
        const user=await this.userModel.findById(postDto.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const savePost = await post.save();
        const {ask_for_reviews} = postDto;
        if (ask_for_reviews) {
            let reviews = [];
            ask_for_reviews.forEach((review) => {
                reviews.push({
                    post_id: savePost._id,
                    product_name: review,
                });
            });
            await this.reviewsModel.insertMany(reviews);
        }
        const updatedPost=await this.postModel.findById(savePost._id).lean();
        updatedPost.userId={_id:user._id,profile_image_url:user.profile_image_url,user_name:user.user_name};

        const hashTags=getHashtagFromPost(postDto.add_caption);

        for(let i=0;i<hashTags.length;i++){
            this.hashtagService.saveAndAddPost((savePost._id).toString(),hashTags[i]);
        }


        return successResponse(200, 'Post created', updatedPost);
    };

    updatePost = async (updatePostDto: UpdatePostDto) => {
        const post = await this.postModel.findById(updatePostDto.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        post.add_caption = updatePostDto.add_caption || post.add_caption;
        post.post_images = updatePostDto.post_images || post.post_images;
        post.post_videos = updatePostDto.post_videos || post.post_videos;
        post.blocked = updatePostDto.blocked || post.blocked;
        try {
            await post.save();
            return successResponse(200, 'Post Updated', post);
        } catch (e) {
            throw new BadRequestException('Post not updated.');
        }
    };

    getAllPosts = async () => {
        const posts:any = await this.postModel.find({})
            .sort({timestamp: -1})
            .populate('userId')

        return successResponse(200, 'Posts', posts);
    };


    getPostById = async (id:String) => {
        const posts:any = await this.postModel.findById(id).populate('userId');
        return successResponse(200, 'Posts', posts);
    };

    getAllPostsWithUserLikes = async (id:String) => {
        const posts:any = await this.postModel
            .find({})
            .sort({timestamp: -1})
            .populate('whoDisLikes.userId', 'user_name profile_image_url')
            .populate('userId', 'user_name profile_image_url')
            .populate('whoLikes.userId', 'user_name profile_image_url').lean();


        const filteredPosts = [];

        for (let post of posts) {
            const userLike = post.whoLikes && (post.whoLikes.filter((userLike) => userLike.userId &&
                (userLike.userId).toString() === id)).length > 0 ? true : false
            const userDisLikes = post.whoDisLikes && (post.whoDisLikes.filter((userDisLike) => userDisLike.userId &&
                (userDisLike.userId).toString() === id)).length > 0 ? true : false

            post.user_liked = userLike;
            post.user_disLiked = userDisLikes;

            delete post["whoLikes"]
            delete post["whoDisLikes"]


            filteredPosts.push(post);

        }


        return successResponse(200, 'Posts', filteredPosts);
    };

    getPostsByUserId = async (id: String) => {
        const posts: any = await this.postModel
            .find({userId: id})
            .sort({timestamp: -1})
            .populate('userId', 'user_name profile_image_url')
            .populate('whoDisLikes.userId', 'user_name profile_image_url')
            .populate('whoLikes.userId', 'user_name profile_image_url')
                .lean()
        ;


        if (!posts) {
            return errorResponse(404, 'Posts not found');
        }

        const filteredPosts = [];

        for (let post of posts) {
            const userLike = post.whoLikes && (post.whoLikes.filter((userLike) => userLike.userId &&
                (userLike.userId).toString() === id)).length > 0 ? true : false
            const userDisLikes = post.whoDisLikes && (post.whoDisLikes.filter((userDisLike) => userDisLike.userId &&
                (userDisLike.userId).toString() === id)).length > 0 ? true : false

            post.user_liked = userLike;
            post.user_disLiked = userDisLikes;

            delete post["whoLikes"]
            delete post["whoDisLikes"]


            filteredPosts.push(post);

        }

        if (posts) {
            return successResponse(200, 'Posts', filteredPosts);
        }
    };

    deletePost = async (id: string) => {
        const post = await this.postModel.findByIdAndDelete(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return successResponse(200, 'Posts Deleted', post);
    };

    postLike = async (likePayload: LikePostDto) => {
        const post = await this.postModel.findById(likePayload.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        const  user=await this.userModel.findById(likePayload.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        let postLikesArray = post.whoLikes;
        let postDisLikesArray = post.whoDisLikes;

        const filterDisLikes = postDisLikesArray.filter(
            (dislike) => dislike.userId != likePayload.userId,
        );
        const filterLikes = postLikesArray.filter(
            (like) => like.userId == likePayload.userId,
        );

        if (filterLikes.length > 0) {
            postLikesArray=postLikesArray.filter(
                (like) => like.userId !== likePayload.userId,
            );
        }else {
            postLikesArray.push({userId: likePayload.userId});
        }
        post.whoLikes = postLikesArray;
        post.numberOfLikes = postLikesArray.length;
        post.whoDisLikes = filterDisLikes;
        post.numberOfDisLikes = filterDisLikes.length;
        try {
            await post.save();
            const filteredPost=JSON.parse(JSON.stringify(post));
            const userLike = post.whoLikes && (post.whoLikes.filter((userLike) => userLike.userId &&
                (userLike.userId).toString() === likePayload.userId)).length > 0 ? true : false
            const userDisLikes = post.whoDisLikes && (post.whoDisLikes.filter((userDisLike) => userDisLike.userId &&
                (userDisLike.userId).toString() === likePayload.userId)).length > 0 ? true : false

            filteredPost.user_liked = userLike;
            filteredPost.user_disLiked = userDisLikes;
            filteredPost.userId={_id:user._id,profile_image_url:user.profile_image_url,user_name:user.user_name};
            delete filteredPost["whoLikes"]
            delete filteredPost["whoDisLikes"]

            const notificationPayload:NotificationType={user_id:post.userId,type:NotificationTypeEnum.POST_LIKE,
                message:getNotificationMessage(NotificationTypeEnum.POST_LIKE,user.first_name,user.last_name),
                profile_info:{first_name:user.first_name,last_name:user.last_name,profile_image_url:user.profile_image_url}}
            await this.notificationService.add(notificationPayload);

            return successResponse(200, 'Post like success', filteredPost);
        } catch (e) {
            throw new BadRequestException('Failed to like post');
        }
    };

    postSingleImageLike = async (likePayload: LikeSinglePostImageDto) => {
        const post = await this.postModel.findById(likePayload.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.post_images) {
            const filterImage = post.post_images.filter(
                (image) => image._id == likePayload.postImageId,
            );
            if (filterImage.length === 0) {
            }

            let postImages = post.post_images.map((singleImage) => {
                let returnImage = singleImage;
                if (singleImage._id == likePayload.postImageId) {
                    if (singleImage.reviews) {
                        let reviews = singleImage.reviews.map((singleReview) => {
                            let returnReview = singleReview;
                            if (singleReview.product_name == likePayload.reviewItemName) {
                                let postDisLikesArray = returnReview.who_dislikes;

                                const filterDisLikes = postDisLikesArray.filter(
                                    (dislike) => dislike != likePayload.userId,
                                );

                                let postLikesArray = returnReview.who_likes;
                                const filterLikes = postLikesArray.filter(
                                    (like) => like == likePayload.userId,
                                );
                                if (filterLikes.length > 0) {
                                    postLikesArray=postLikesArray.filter(
                                        (like) => like !== likePayload.userId,
                                    );
                                }else{
                                    postLikesArray.push(likePayload.userId);
                                }
                                returnReview.who_dislikes = filterDisLikes;
                                returnReview.number_of_disLikes = filterDisLikes.length;
                                returnReview.who_likes = postLikesArray;
                                returnReview.number_of_likes = postLikesArray.length;
                            }
                            return returnReview;
                        });
                        returnImage.reviews = reviews;
                    }
                }
                return returnImage;
            });
            post.post_images = postImages;
        }

        try {
            await post.save();
            return successResponse(200, 'Post like success', post);
        } catch (e) {
            throw new BadRequestException('Failed to like post');
        }
    };

    postSingleVideoLike = async (likePayload: LikeSinglePostVideoDto) => {
        const post = await this.postModel.findById(likePayload.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.post_videos) {
            const filterImage = post.post_videos.filter(
                (video) => video._id == likePayload.postVideoId,
            );
            if (filterImage.length === 0) {
            }

            let postImages = post.post_videos.map((singleImage) => {
                let returnImage = singleImage;
                if (singleImage._id == likePayload.postVideoId) {
                    if (singleImage.reviews) {
                        let reviews = singleImage.reviews.map((singleReview) => {
                            let returnReview = singleReview;
                            if (singleReview.product_name == likePayload.reviewItemName) {
                                let postDisLikesArray = returnReview.who_dislikes;

                                const filterDisLikes = postDisLikesArray.filter(
                                    (dislike) => dislike != likePayload.userId,
                                );

                                let postLikesArray = returnReview.who_likes;
                                const filterLikes = postLikesArray.filter(
                                    (like) => like == likePayload.userId,
                                );
                                if (filterLikes.length > 0) {
                                    postLikesArray=postLikesArray.filter(
                                        (like) => like !== likePayload.userId,
                                    );
                                }else{
                                    postLikesArray.push(likePayload.userId);
                                }
                                returnReview.who_dislikes = filterDisLikes;
                                returnReview.number_of_disLikes = filterDisLikes.length;
                                returnReview.who_likes = postLikesArray;
                                returnReview.number_of_likes = postLikesArray.length;
                            }
                            return returnReview;
                        });
                        returnImage.reviews = reviews;
                    }
                }
                return returnImage;
            });
            post.post_images = postImages;
        }

        try {
            await post.save();
            return successResponse(200, 'Post like success', post);
        } catch (e) {
            throw new BadRequestException('Failed to like post');
        }
    };

    postDisLike = async (disLikePayload: DisLikePostDto) => {
        const post: any = await this.postModel.findById(disLikePayload.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        const user: any = await this.userModel.findById(disLikePayload.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        let postLikesArray = post.whoLikes;

        let postDisLikesArray = post.whoDisLikes;
        const filterDisLikes = postDisLikesArray.filter(
            (dislike) => dislike.userId == disLikePayload.userId,
        );
        const filterLikes = postLikesArray.filter(
            (like) => like.userId != disLikePayload.userId,
        );
        if (filterDisLikes.length > 0) {
            postDisLikesArray=postDisLikesArray.filter(
                (like) => like.userId != disLikePayload.userId,
            );
        }else{
            postDisLikesArray.push({userId: disLikePayload.userId});
        }
        post.whoDisLikes = postDisLikesArray;
        post.numberOfDisLikes = postDisLikesArray.length;
        post.whoLikes = filterLikes;
        post.numberOfLikes = filterLikes.length;
        try {
            await post.save();

            const filteredPost=JSON.parse(JSON.stringify(post));
            const userLike = post.whoLikes && (post.whoLikes.filter((userLike) => userLike.userId &&
                (userLike.userId).toString() === disLikePayload.userId)).length > 0 ? true : false
            const userDisLikes = post.whoDisLikes && (post.whoDisLikes.filter((userDisLike) => userDisLike.userId &&
                (userDisLike.userId).toString() === disLikePayload.userId)).length > 0 ? true : false

            filteredPost.user_liked = userLike;
            filteredPost.user_disLiked = userDisLikes;
            filteredPost.userId={_id:user._id,profile_image_url:user.profile_image_url,user_name:user.user_name};

            delete filteredPost["whoLikes"]
            delete filteredPost["whoDisLikes"]

            return successResponse(200, 'Post dislike success', filteredPost);
        } catch (e) {
            throw new BadRequestException('Failed to dislike post');
        }
    };

    postSingleImageDisLike = async (likePayload: LikeSinglePostImageDto) => {
        const post = await this.postModel.findById(likePayload.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.post_images) {
            const filterImage = post.post_images.filter(
                (image) => image._id == likePayload.postImageId,
            );
            if (filterImage.length === 0) {
            }

            let postImages = post.post_images.map((singleImage) => {
                let returnImage = singleImage;
                if (singleImage._id == likePayload.postImageId) {
                    if (singleImage.reviews) {
                        let reviews = singleImage.reviews.map((singleReview) => {
                            let returnReview = singleReview;
                            if (singleReview.product_name == likePayload.reviewItemName) {
                                let postDisLikesArray = returnReview.who_dislikes;
                                let postLikesArray = returnReview.who_likes;
                                const filterDisLikes = postDisLikesArray.filter(
                                    (dislike) => dislike == likePayload.userId,
                                );
                                const filterLikes = postLikesArray.filter(
                                    (like) => like != likePayload.userId,
                                );
                                if (filterDisLikes.length > 0) {
                                    postDisLikesArray=postDisLikesArray.filter(
                                        (dislike) => dislike != likePayload.userId,
                                    );
                                }else{
                                    postDisLikesArray.push(likePayload.userId);
                                }
                                returnReview.who_dislikes = postDisLikesArray;
                                returnReview.number_of_disLikes = postDisLikesArray.length;
                                returnReview.who_likes = filterLikes;
                                returnReview.number_of_likes = filterLikes.length;
                            }
                            return returnReview;
                        });
                        returnImage.reviews = reviews;
                    }
                }
                return returnImage;
            });
            post.post_images = postImages;
        }

        try {
            await post.save();
            return successResponse(200, 'Post like success', post);
        } catch (e) {
            throw new BadRequestException('Failed to like post');
        }
    };

    postSingleVideoDisLike = async (likePayload: DisLikeSinglePostVideoDto) => {
        const post = await this.postModel.findById(likePayload.postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.post_videos) {
            const filterImage = post.post_videos.filter(
                (video) => video._id == likePayload.postVideoId,
            );
            if (filterImage.length === 0) {
            }

            let postImages = post.post_videos.map((singleImage) => {
                let returnImage = singleImage;
                if (singleImage._id == likePayload.postVideoId) {
                    if (singleImage.reviews) {
                        let reviews = singleImage.reviews.map((singleReview) => {
                            let returnReview = singleReview;
                            if (singleReview.product_name == likePayload.reviewItemName) {
                                let postDisLikesArray = returnReview.who_dislikes;
                                let postLikesArray = returnReview.who_likes;
                                const filterDisLikes = postDisLikesArray.filter(
                                    (dislike) => dislike == likePayload.userId,
                                );
                                const filterLikes = postLikesArray.filter(
                                    (like) => like != likePayload.userId,
                                );
                                if (filterDisLikes.length > 0) {
                                    postDisLikesArray=postDisLikesArray.filter(
                                        (dislike) => dislike !== likePayload.userId,
                                    );
                                }else{
                                    postDisLikesArray.push(likePayload.userId);
                                }
                                returnReview.who_dislikes = postDisLikesArray;
                                returnReview.number_of_disLikes = postDisLikesArray.length;
                                returnReview.who_likes = filterLikes;
                                returnReview.number_of_likes = filterLikes.length;
                            }
                            return returnReview;
                        });
                        returnImage.reviews = reviews;
                    }
                }
                return returnImage;
            });
            post.post_images = postImages;
        }

        try {
            await post.save();
            return successResponse(200, 'Post like success', post);
        } catch (e) {
            throw new BadRequestException('Failed to like post');
        }
    };

    // Comments Apis
    createComment = async (creatComment: CreateCommentDto) => {
        const comment = new this.commentsModel(creatComment);
        const posts = await this.postModel.findById(creatComment.postId);
        if (!posts) {
            throw new NotFoundException('Post against postId not exists.');
        }
        const commentCout = await this.commentsModel.count({
            postId: creatComment.postId,
        });

        posts.number_of_Comments = commentCout + 1;
        const saveComment = await comment.save();
        await posts.save();


        const postUser=await this.userModel.findById(posts.userId);
        const otherUser=await this.userModel.findById(creatComment.userId);

        const notificationPayload:NotificationType={user_id:posts.userId,type:NotificationTypeEnum.POST_COMMENT,
            message:getNotificationMessage(NotificationTypeEnum.POST_COMMENT,otherUser.first_name,otherUser.last_name),
            profile_info:{first_name:otherUser.first_name,last_name:otherUser.last_name,profile_image_url:otherUser.profile_image_url}}
        await this.notificationService.add(notificationPayload)


        return successResponse(200, 'Comment Created', saveComment);
    };

    updateComment = async (updateComment: UpdateCommentDto) => {
        const comment = await this.commentsModel.findById(updateComment.commentId);

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        comment.comment_text = updateComment.comment_text || comment.comment_text;

        try {
            await comment.save();
            return successResponse(200, 'Comment Updated', comment);
        } catch (e) {
            throw new BadRequestException('Failed to update comment.');
        }
    };

    getCommentsByPostId = async (id: string) => {
        const comments = await this.commentsModel
            .find({postId: id})
            .populate('sub_comments')
            .populate('userId', 'email user_name profile_image_url');
        if (!comments) {
            throw new NotFoundException('Comments not found');
        }

        return successResponse(200, 'Comments', comments);
    };

    getAllComments = async () => {
        const comments = await this.commentsModel.find({});
        if (!comments) {
            throw new NotFoundException('Comments not found');
        }

        return successResponse(200, 'Comments', comments);
    };

    deleteComment = async (id: string) => {
        const comments = await this.commentsModel.findByIdAndDelete(id);
        if (!comments) {
            throw new NotFoundException('Comments not found');
        }

        return successResponse(200, 'Comment deleted', comments);
    };

    commentLike = async (likePayload: LikeCommentDto) => {
        const comment = await this.commentsModel.findById(likePayload.commentId);
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        let commentLikesArray = comment.who_likes;
        commentLikesArray.push(likePayload.userId);
        comment.who_likes = commentLikesArray;
        comment.number_of_likes = commentLikesArray.length;
        try {
            await comment.save();
            return successResponse(200, 'Comment like success', comment);
        } catch (e) {
            throw new BadRequestException('Failed to like comment');
        }
    };

    // Sub Comments Apis
    createSubComment = async (creatSubComment: CreateSubCommentDto) => {
        const subComments = new this.subCommentsModel(creatSubComment);
        const saveSubComment = await subComments.save();
        let findComment = await this.commentsModel.findById(
            creatSubComment.comment_id,
        );
        if (!findComment) {
            return errorResponse(404, 'Comment not found');
        }
        let sub_com = findComment.sub_comments;
        sub_com.push(saveSubComment._id);
        findComment.sub_comments = sub_com;
        await findComment.save();
        return successResponse(200, 'Sub Comment created', saveSubComment);
    };

    updateSubComment = async (updateComment: UpdateSubCommentDto) => {
        const subComment = await this.subCommentsModel.findById(
            updateComment.sub_comment_id,
        );

        if (!subComment) {
            throw new NotFoundException('Sub Comment not found');
        }
        subComment.comment_text =
            updateComment.comment_text || subComment.comment_text;

        try {
            await subComment.save();

            return successResponse(200, 'Sub Comment updated', subComment);
        } catch (e) {
            throw new BadRequestException('Failed to update Sub Comment.');
        }
    };

    getAllSubComments = async () => {
        const subComments = await this.subCommentsModel.find({});
        if (!subComments) {
            throw new NotFoundException('Sub Comments not found');
        }

        return successResponse(200, 'All Sub Comments', subComments);
    };

    deleteSubComment = async (id: string) => {
        const subComment = await this.subCommentsModel.findByIdAndDelete(id);
        if (!subComment) {
            throw new NotFoundException('Comments not found');
        }

        return successResponse(200, 'Sub Comment deleted', subComment);
    };

    // Reviews Apis
    createReview = async (reviewPayload: CreateReviewDto) => {
        const reviewsToCreate = reviewPayload.reviews.map((review) => {
            return {
                post_id: reviewPayload.post_id,
                product_name: review,
            };
        });

        const saveReview = await this.reviewsModel.insertMany(reviewsToCreate);
        return successResponse(200, 'Reviews Inserted', saveReview);
    };

    createSingleReview = async (name: string) => {
        const singleReview = new this.reviewsModel({product_name: name});
        const saveReview = await singleReview.save();
        return successResponse(200, 'Reviews Inserted', saveReview);
    };

    updateReview = async (reviewPayload: UpdateReviewDto) => {
        const findReview = await this.reviewsModel.findById(
            reviewPayload.review_id,
        );
        if (!findReview) {
            throw new NotFoundException('Review not found');
        }
        findReview.product_name =
            reviewPayload.product_name || findReview.product_name;

        await findReview.save();
        return successResponse(200, 'Review updated', findReview);
    };

    likeReview = async (reviewPayload: LikeReviewDto) => {
        const findReview = await this.reviewsModel.findById(
            reviewPayload.review_id,
        );
        if (!findReview) {
            throw new NotFoundException('Review not found');
        }
        let whoLikes = findReview.who_likes;
        whoLikes.push(reviewPayload.user_id);
        findReview.who_likes = whoLikes;
        findReview.number_of_likes = whoLikes.length;

        await findReview.save();
        return successResponse(200, 'Review liked', findReview);
    };

    disLikeReview = async (reviewPayload: LikeReviewDto) => {
        const findReview = await this.reviewsModel.findById(
            reviewPayload.review_id,
        );
        if (!findReview) {
            throw new NotFoundException('Review not found');
        }
        let whoDisLikes = findReview.who_dislikes;
        whoDisLikes.push(reviewPayload.user_id);
        findReview.who_dislikes = whoDisLikes;
        findReview.number_of_disLikes = whoDisLikes.length;

        await findReview.save();
        return successResponse(200, 'Review disliked', findReview);
    };

    getPostReviews = async (id: string) => {
        const reviews = await this.reviewsModel.find({post_id: id});
        if (!reviews) {
            throw new NotFoundException('Reviews not found');
        }
        return successResponse(200, 'Reviews', reviews);
    };

    getReviewById = async (id: string) => {
        const review = await this.reviewsModel.findById(id);
        if (!review) {
            throw new NotFoundException('Reviews not found');
        }
        return successResponse(200, 'Review', review);
    };

    getAllReviews = async () => {
        const reviews = await this.reviewsModel.find({});
        if (!reviews) {
            throw new NotFoundException('Reviews not found');
        }
        return successResponse(200, 'Review', reviews);
    };


    updatePostPrivacy = async (postId:String,createPrivacyPolicy: CreatePrivacyPolicyDto) => {
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        post.privacy=createPrivacyPolicy;
        await post.save();
        return successResponse(200, 'Post privacy updated', post);
    };


    searchByField = async (filter:SearchAndFilterDto) => {
        let users: any = await this.postModel.find({[filter.search.field]:{$in:filter.search.value}});
        return successResponse(200, 'filter', users);
    };


    updateMultiplePosts = async (payload:UpdateMultiplePostsDto) => {
        let updatedPosts=[];
        for(let p of payload.posts){
            const post=await this.postModel.findById(p.postId);
            if(post){
                post.set(p);
                const updatedUser=await post.save();
                updatedPosts.push(updatedUser);

            }
        }
        return successResponse(200, 'posts updated ',updatedPosts);
    };


}
