import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WithdrawMethodSchema } from './models/withdraw-method.model';
import { WithdrawMethodController } from './withdraw-method.controller';
import { WithdrawMethodService } from './withdraw-method.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'withdrawmethods', schema: WithdrawMethodSchema },
    ]),
  ],
  controllers: [WithdrawMethodController],
  providers: [WithdrawMethodService],
})
export class WithdrawMethodModule {}
