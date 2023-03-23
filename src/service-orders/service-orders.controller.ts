import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {
    CreateServiceOrderDto, UpdateMultipleServiceOrdersDto,
    UpdateServiceOrderDto,
} from './dtos/service-orders.dto';
import {ServiceOrdersService} from './service-orders.service';
import mongoose from 'mongoose';
import {errorResponse} from '../utils/response';
import {CreateServiceOrderMessageDto} from './dtos/service-order-conversation.dto';
import {UpdateMultipleServicesDto} from "../services/dtos/services.dto";
import {SearchAndFilterDto} from "../users/dtos/search-and-filter.dto";

@Controller('service-orders')
export class ServiceOrdersController {
    constructor(private serviceOrdersService: ServiceOrdersService) {
    }

    @Post('/')
    async create(@Body() body: CreateServiceOrderDto) {
        const service = await this.serviceOrdersService.create(body);
        return service;
    }

    @Put('/')
    async update(@Body() body: UpdateServiceOrderDto) {
        const service = await this.serviceOrdersService.update(body);
        return service;
    }


    @Get('/')
    async getAllServiceOrders() {
        const service = await this.serviceOrdersService.getAllServiceOrders();
        return service;
    }

    @Get('/detail/:id')
    async getById(@Param('id') id: String) {
        let checkUserId = mongoose.isValidObjectId(id);
        if (!checkUserId) {
            return errorResponse(500, 'serviceOrderId is not a valid id');
        }
        const service = await this.serviceOrdersService.getById(id);
        return service;
    }

    @Delete('/:id')
    async deleteServiceOrderById(@Param('id') id: String) {
        const service = await this.serviceOrdersService.deleteOrder(id);
        return service;
    }


    @Get('/user/:id')
    async getByUserId(@Param('id') id: String) {
        let checkUserId = mongoose.isValidObjectId(id);
        if (!checkUserId) {
            return errorResponse(500, 'userId is not a valid id');
        }
        const service = await this.serviceOrdersService.getByUserId(id);
        return service;
    }

    @Get('/service_provider/:id')
    async getByServiceProviderId(@Param('id') id: String) {
        let checkUserId = mongoose.isValidObjectId(id);
        if (!checkUserId) {
            return errorResponse(500, 'serviceProviderId is not a valid id');
        }
        const service = await this.serviceOrdersService.getByServiceProviderId(id);
        return service;
    }

    @Get('/conversation/service_order_id/:id')
    async getByServiceConversation(@Param('id') id: String) {
        console.log('Iddd :: ', id);
        let checkUserId = mongoose.isValidObjectId(id);
        if (!checkUserId) {
            return errorResponse(500, 'serviceOrderId is not a valid id');
        }
        const conversations = await this.serviceOrdersService.getConversation(id);
        return conversations;
    }

    @Post('/conversation/message')
    async createConversationMessage(
        @Body() messageDto: CreateServiceOrderMessageDto,
    ) {
        const createMessage =
            await this.serviceOrdersService.createConversationMessage(messageDto);
        return createMessage;
    }


    @Put('/multiple')
    async updateMultipleServices(@Body() body: UpdateMultipleServiceOrdersDto) {
        const services = await this.serviceOrdersService.updateMultipleServices(body);
        return services;
    }


    @Post('/search')
    async searchByAnyField(@Body() body: SearchAndFilterDto) {
        const services = await this.serviceOrdersService.searchByField(body);
        return services;
    }


    @Get('/user/:id/stats')
    async getMonthlyOrderCompletedStats(@Param('id') id: string) {
        const services = await this.serviceOrdersService.getMonthlyOrderCompletedStats(id);
        return services;
    }
}
