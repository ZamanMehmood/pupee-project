import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateGoalDto } from './dtos/goals.dto';
import { GoalDocument } from './models/goals.model';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel('goals')
    private readonly goalModel: Model<GoalDocument>,
  ) {}

  async create(name: string) {
    const newGoal = new this.goalModel({ name });
    const saveGoal = await newGoal.save();
    return successResponse(200, 'Goal created', saveGoal);
  }

  async update(payload: UpdateGoalDto) {
    const goal: any = await this.goalModel.findById(payload.goal_id);
    if (goal) {
      goal.name = payload.name || goal.name;
      await goal.save();
      return successResponse(200, 'Goal Updated', goal);
    } else {
      return errorResponse(404, 'Goal not found');
    }
  }

  async getAll() {
    const goals = await this.goalModel.find({});
    if (goals) {
      return successResponse(200, 'Goals', goals);
    } else {
      return errorResponse(404, 'Goals not found');
    }
  }
}
