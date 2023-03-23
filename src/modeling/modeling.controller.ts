import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ModelingService} from "./modeling.service";
import {
    AddModelPortfolio,
    AddRatingCategoryDto,
    AddSearchDto,
    AddVoteDto,
    BuyPortfolio,
    CreateModelDto,
    UpdateModelDto,
    UpdatePortfolioDto
} from "./dto/modeling.dto";
import {FilterDto} from "./dto/filter.dto";
import {AddStatsDto} from "./dto/stats.dto";
import {CreateModelChatMessageDto} from "./dto/chat.dto";

@Controller('modeling')
export class ModelingController {
    constructor(private modelingService: ModelingService) {
    }





    @Post('/')
    async create(@Body() payload: CreateModelDto) {
        const model = await this.modelingService.create(payload);
        return model;
    }

    @Get()
    findAllModels() {
        return this.modelingService.findAll();
    }

    @Put('/:id')
    async update(@Param('id') id: string,@Body() payload: UpdateModelDto) {
        const model = await this.modelingService.update(id,payload);
        return model;
    }


    @Post('/:id/category/:category/vote')
    async addVote(@Param('id') id: string,@Param('category') categoryId: string,@Body() payload: AddVoteDto) {
        const model = await this.modelingService.addVote(id,categoryId,payload);
        return model;
    }

    @Delete('/:id/vote/:voteId/list/:listId')
    async deleteVote(@Param('id') id: string,@Param('voteId') voteId: string,@Param('listId') listId) {
        const model = await this.modelingService.removeVote(id,voteId,listId);
        return model;
    }

    @Post('/filter')
    async filterModel(@Body() body: FilterDto) {
        const model = await this.modelingService.filterModel(body);
        return model;
    }



    @Put('/:id/search')
    async addSearch(@Param('id') id: string,@Body() payload: AddSearchDto) {
        const search = await this.modelingService.addSearchResult(id,payload);
        return search;
    }


    @Put('/:id/search/:searchId')
    async updateSearch(@Param('id') id: string,@Param('searchId') searchId: string,@Body() payload: AddSearchDto) {
        const search = await this.modelingService.updateSearchResult(id,searchId,payload);
        return search;
    }


    @Delete('/:id/search/:searchId')
    async deleteSearch(@Param('id') id: string,@Param('searchId') searchId: string) {
        const search = await this.modelingService.deleteSearch(id,searchId);
        return search;
    }


    @Get('/:id')
    async getSearch(@Param('id') id: string) {
        const search = await this.modelingService.getModelById(id);
        return search;
    }


    @Post('/:id/stats/:statId')
    async addModelStats(@Param('id') id: string,@Param('statId') statId: string,@Body() payload: AddStatsDto) {
        const stat = await this.modelingService.addModelStats(id,statId,payload);
        return stat;
    }

    @Get('/:id/stats/:statId')
    async getModelStats(@Param('id') id: string,@Param('statId') statId: string) {
        const search = await this.modelingService.getModelStats(id,statId);
        return search;
    }


    @Get('/user/:userId')
    async getModelByUser(@Param('id') id: string,@Param('userId') userId: string) {
        const search = await this.modelingService.getModelByUserId(userId);
        return search;
    }


    @Post('/chat')
    async postChatMessage(@Body() payload: CreateModelChatMessageDto) {
        const search = await this.modelingService.addChatMessage(payload);
        return search;
    }


    @Get('/chat/:senderId/:receiverId')
    async getChatMessages(@Param('senderId') senderId: string,@Param('receiverId') receiverId: string) {
        const search = await this.modelingService.getModelChatMessages(senderId,receiverId);
        return search;
    }


    @Delete('/chat/:id/')
    async deleteChatMessage(@Param('id') id: string) {
        const search = await this.modelingService.deleteMessage(id);
        return search;
    }



    @Post('/rating/category')
    async addRatingCategory(@Body() payload: AddRatingCategoryDto) {
        const ratingCategory = await this.modelingService.addRatingCategory(payload);
        return ratingCategory;
    }

    @Put('/rating/category/:id')
    async updateRatingCategory(@Param('id') id,@Body() payload: AddRatingCategoryDto) {
        const ratingCategory = await this.modelingService.updateRatingCategory(id,payload);
        return ratingCategory;
    }

    @Get('/rating/category')
    async getRatingCategories() {
        const ratingCategory = await this.modelingService.getAllRatingCategories();
        return ratingCategory;
    }


    @Get('/rating/category/:id')
    async getRatingCategoryById(@Param('id') id) {
        const ratingCategory = await this.modelingService.getRatingCategoryById(id);
        return ratingCategory;
    }

    @Delete('/rating/category/:id')
    async deleteRatingCategory(@Param('id') id) {
        const ratingCategory = await this.modelingService.deleteRatingCategory(id);
        return ratingCategory;
    }

    @Put('/:id/portfolio')
    async updateModelPortfolio(@Param('id') id,@Body() payload: UpdatePortfolioDto) {
        const portfolio = await this.modelingService.updateModelPortfolio(id,payload);
        return portfolio;
    }


    @Post('/:id/portfolio')
    async postPortfolio(@Param('id') id,@Body() payload: AddModelPortfolio) {
        const portfolio = await this.modelingService.addModelPortfolio(id,payload);
        return portfolio;
    }


    @Delete('/:id/portfolio/:portfolioId')
    async deletePortfolio(@Param('id') id,@Param('portfolioId') portfolioId) {
        const portfolio = await this.modelingService.deletePortfolio(id,portfolioId);
        return portfolio;
    }


    @Post('/:id/portfolio/:portfolioId/buy')
    async buyPortfolio(@Param('id') id,@Param('portfolioId') portfolioId,@Body() payload: BuyPortfolio) {
        const portfolio = await this.modelingService.buyModelPortfolios(id,portfolioId,payload);
        return portfolio;
    }



    @Get('/:id/buy-portfolio-stats')
    async getPortfolioStats(@Param('id') id) {
        const portfolio = await this.modelingService.getModelBuyPortfolioStats(id);
        return portfolio;
    }
}
