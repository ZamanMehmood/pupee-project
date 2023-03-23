import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class CreateSubCommentDto {
    @IsString()
    @IsNotEmpty()
    comment_id: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    comment_text: string
  }

  export class UpdateSubCommentDto {
    @IsString()
    @IsNotEmpty()
    sub_comment_id: string;
  
    @IsString()
    @IsNotEmpty()
    comment_text: string
  }

  export class DeleteSubCommentDto {
    @IsString()
    @IsNotEmpty()
    sub_comment_id: string;
  }