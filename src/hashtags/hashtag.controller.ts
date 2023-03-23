import {Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe} from '@nestjs/common';
import {GetInvitation} from "../users/dtos/invitation.dto";
import {HashtagService} from "./hashtag.service";

@Controller('hashtag')
export class HashtagController {
    constructor(private hashtagService: HashtagService) {
    }

    @Get('/:tag/user/:userId/search')
    async searchHashtag(@Param('tag') tag: string,@Param('userId') userId: string) {
        const search = await this.hashtagService.getHashtagPosts(userId,tag);
        return search;
    }

    @Get('/')
    async getAllHashtags() {
        const search = await this.hashtagService.get();
        return search;
    }

}
