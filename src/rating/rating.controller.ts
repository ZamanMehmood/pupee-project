import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {RatingService} from './rating.service';
import {CreateRating} from "./dtos/rating.dto";

@Controller('rating')
export class RatingController {
    constructor(private ratingService: RatingService) {
    }





    @Post('/')
    async create(@Body() payload: CreateRating) {
        const rating = await this.ratingService.addRating(payload);
        return rating;
    }





    @Get('/:id')
    async getById(@Param('id') id: string) {
        const userPaymentCards = await this.ratingService.getRatingById(id);
        return userPaymentCards;
    }

    @Get('/:id/user')
    async getByUserId(@Param('id') id: string) {
        const userPaymentCards = await this.ratingService.getRatingByUserId(id);
        return userPaymentCards;
    }
}
