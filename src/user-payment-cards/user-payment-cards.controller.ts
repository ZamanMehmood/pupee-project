import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {
    AddCreditDto,
    CreateUserPaymentCardsDto,
    CreateUserStripeCardsDto,
    UpdatePaymentMethod, WithdrawalDto
} from './dtos/user-payment-cards.dto';
import {UserPaymentCardsService} from './user-payment-cards.service';

@Controller('user-payment-cards')
export class UserPaymentCardsController {
    constructor(private userPaymentCardsService: UserPaymentCardsService) {
    }





    @Post('/')
    async create(@Body() userPaymentCardsDto: CreateUserStripeCardsDto) {
        const userPaymentCard = await this.userPaymentCardsService.createPaymentMethod(userPaymentCardsDto);
        return userPaymentCard;
    }


    @Get('/create/pendingIntent/:id')
    async createPendingIntent(@Param('id') id: string) {
        const userPaymentCards = await this.userPaymentCardsService.createSetupIntent(id);
        return userPaymentCards;
    }


    @Get('/:id')
    async getAll(@Param('id') id: string) {
        const userPaymentCards = await this.userPaymentCardsService.getAllPaymentMethods(id);
        return userPaymentCards;
    }

    @Put('/default/:id')
    async updatePaymentMethod(@Param('id') id: string,@Body() updatePaymentMethod: UpdatePaymentMethod) {
        const userPaymentCards = await this.userPaymentCardsService.updateDefaultPaymentMethod(updatePaymentMethod,id);
        return userPaymentCards;
    }


    @Get('/user/:id')
    async getByUserId(@Param('id') id: String) {
        const userPaymentCards = await this.userPaymentCardsService.getByUserId(id);
        return userPaymentCards;
    }

    @Post('/credit')
    async addCredit(@Body() addCreditDto: AddCreditDto) {
        const addAmount = await this.userPaymentCardsService.createCreditPayment(addCreditDto);
        return addAmount;
    }

    @Post('/:id/withdrawal')
    async withdrawalAmount(@Param('id') id: String,@Body() withdrawal: WithdrawalDto) {
        const addAmount = await this.userPaymentCardsService.withdrawalAmount(id,withdrawal);
        return addAmount;
    }


    @Delete('/user/:id/paymentMethod/:paymentMethodId')
    async deletePaymentMethod(@Param('id') id: String,@Param('paymentMethodId') paymentMethodId: String) {
        const userPaymentCards = await this.userPaymentCardsService.deletePaymentMethod(id,paymentMethodId);
        return userPaymentCards;
    }
}
