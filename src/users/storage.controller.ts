import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {CreateInterestDto, UpdateInterestDto} from './dtos/interest.dto';
import {InterestsService} from './interests.service';
import {StorageService} from "./storage.service";
import {BuyStorageDto, CreateStorage, UpdateStorage} from "./dtos/storage.dto";

@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) {
    }

    @Post('/')
    async createStorage(@Body() body: CreateStorage) {
        const storage = await this.storageService.create(body);
        return storage;
    }

    @Put('/:id')
    async updateStorage(@Param('id') id: string,@Body() body: UpdateStorage) {
        const storage = await this.storageService.update(id,body);
        return storage;
    }


    @Delete('/:id')
    async deleteStorage(@Param('id') id: string) {
        const storage = await this.storageService.delete(id);
        return storage;
    }

    @Post('/:id/user/:userId/buy')
    async buyStorage(@Param('id') id: string,@Param('userId') userId: string,@Body() body: BuyStorageDto) {
        const storage = await this.storageService.buyStorage(id,userId,body);
        return storage;
    }


    @Get('/:id')
    async getAllStorageById(@Param('id') id: string) {
        const storage = await this.storageService.getById(id);
        return storage;
    }

    @Get('/')
    async getAllStorage() {
        const storage = await this.storageService.getAll();
        return storage;
    }
}
