import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankNameService } from './bank-name.service';
import { CreateBankNameDto } from './dtos/bank-name.dto';

@Controller('bank-name')
export class BankNameController {
  constructor(private bankNameService: BankNameService) {}

  @Post('/')
  async createBankName(@Body() body: CreateBankNameDto) {
    const response = await this.bankNameService.create(body.name);
    return response;
  }

  @Get('/')
  async getAll() {
    const response = await this.bankNameService.getAll();
    return response;
  }
}
