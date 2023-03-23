import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {StaticDataService} from './static-data.service';
import {CreateStaticDataDto} from './dtos/static-data.dto';

@Controller('static-data')
export class StaticDataController {
    constructor(private staticDatService: StaticDataService) {
    }

    @Post('/')
    async create(@Body() body: CreateStaticDataDto) {
        const response = await this.staticDatService.create(body);
        return response;
    }

    @Put('/:id')
    async update(@Param('id') staticDataId,@Body() body: CreateStaticDataDto) {
        const response = await this.staticDatService.update(staticDataId,body);
        return response;
    }

    @Delete('/:id')
    async delete(@Param('id') staticDataId) {
        const response = await this.staticDatService.delete(staticDataId);
        return response;
    }

    @Get('/')
    async getAll() {
        const response = await this.staticDatService.getAll();
        return response;
    }


    @Get('/cities')
    async getAllCities() {
        const response = await this.staticDatService.getAllCities();
        return response;
    }

    @Get('/countries')
    async getAllCountries() {
        const response = await this.staticDatService.getAllCountries();
        return response;
    }


    @Get('/country/:countryCode')
    async getStateOfCountry(@Param('countryCode') countryCode) {
        const response = await this.staticDatService.getStateOfCountry(countryCode);
        return response;
    }

    @Get('/country/:countryCode/:stateCode')
    async getCitiesOfState(@Param('countryCode') countryCode,@Param('stateCode') stateCode) {
        const response = await this.staticDatService.getCitiesOfState(countryCode,stateCode);
        return response;
    }



    @Get('/:type')
    async getByType(@Param('type') type) {
        const response = await this.staticDatService.getByType(type);
        return response;
    }
}
