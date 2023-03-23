import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { GoalSchema } from './models/goals.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'goals', schema: GoalSchema }])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
