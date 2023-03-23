import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankNameController } from './bank-name.controller';
import { BankNameService } from './bank-name.service';
import { BankNameSchema } from './models/bank-name.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'banknames', schema: BankNameSchema }]),
  ],
  controllers: [BankNameController],
  providers: [BankNameService],
})
export class BankNameModule {}
