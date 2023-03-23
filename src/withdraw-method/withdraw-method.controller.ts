import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  CreateWithdrawMethodDto,
  UpdateWithdrawMethodDefaultDto,
  UpdateWithdrawMethodDto,
} from './dtos/withdraw-method.dto';
import { WithdrawMethodService } from './withdraw-method.service';

@Controller('withdraw-method')
export class WithdrawMethodController {
  constructor(private withdrawMethodService: WithdrawMethodService) {}

  @Post('/')
  async createWithdrawMethod(@Body() body: CreateWithdrawMethodDto) {
    const response = await this.withdrawMethodService.create(body);
    return response;
  }

  @Put('/')
  async updateWithdrawMethod(@Body() body: UpdateWithdrawMethodDto) {
    const response = await this.withdrawMethodService.update(body);
    return response;
  }

  @Post('/set_default')
  async updateDefaultWithdrawMethod(
    @Body() body: UpdateWithdrawMethodDefaultDto,
  ) {
    const response = await this.withdrawMethodService.updateDefaultMethod(body);
    return response;
  }

  @Get('/user/:id')
  async getByUserId(@Param('id') id: string) {
    const response = await this.withdrawMethodService.getByUserId(id);
    return response;
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const response = await this.withdrawMethodService.getById(id);
    return response;
  }

  @Get('/')
  async getAll() {
    const response = await this.withdrawMethodService.getAll();
    return response;
  }
}
