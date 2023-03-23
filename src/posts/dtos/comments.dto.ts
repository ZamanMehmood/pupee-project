import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @IsString()
    @IsNotEmpty()
    comment_text: string
  }

  export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    commentId: string;
  
    @IsString()
    @IsNotEmpty()
    comment_text: string
  }

  export class DeleteCommentDto {
    @IsString()
    @IsNotEmpty()
    commentId: string;
  }

  export class LikeCommentDto {
    @IsString()
    @IsNotEmpty()
    commentId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
  }

  export class DisLikeCommentDto {
    @IsString()
    @IsNotEmpty()
    commentId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
  }