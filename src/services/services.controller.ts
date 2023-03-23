import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {CreateServiceDto, UpdateMultipleServicesDto, UpdateServiceDto} from './dtos/services.dto';
import {ServicesService} from './services.service';
import {UpdateMultiplePostsDto} from "../posts/dtos/posts.dto";
import {SearchAndFilterDto} from "../users/dtos/search-and-filter.dto";

@Controller('services')
export class ServicesController {
    constructor(private servicesService: ServicesService) {
    }

    @Post('/')
    async create(@Body() body: CreateServiceDto) {
        const service = await this.servicesService.create(body);
        return service;
    }

    @Get('/')
    async getAll() {
        const services = await this.servicesService.getAll();
        return services;
    }

    @Get('/:id')
    async getById(@Param('id') id: String) {
        const service = await this.servicesService.getById(id);
        return service;
    }

    @Delete('/:id')
    async deleteServiceById(@Param('id') id: String) {
        const service = await this.servicesService.deleteService(id);
        return service;
    }



    @Get('/user/:id')
    async getByUserId(@Param('id') id: string) {
        const services = await this.servicesService.getByUserId(id);
        return services;
    }

    @Put('/multiple')
    async updateMultipleServices(@Body() body: UpdateMultipleServicesDto) {
        const services = await this.servicesService.updateMultipleServices(body);
        return services;
    }


    @Post('/search')
    async searchByAnyField(@Body() body: SearchAndFilterDto) {
        const services = await this.servicesService.searchByField(body);
        return services;
    }

    @Put('/:id')
    async updateService(@Param('id') id: String,@Body() body: UpdateServiceDto) {
        const service = await this.servicesService.updateService(id,body);
        return service;
    }



}
