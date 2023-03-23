import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateGoalDto, UpdateGoalDto } from './dtos/goals.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private goalService: GoalsService) {}

  @Post('/')
  async createGoal(@Body() body: CreateGoalDto) {
    const response = await this.goalService.create(body.name);
    return response;
  }

  @Put('/')
  async updateGoal(@Body() body: UpdateGoalDto) {
    const response = await this.goalService.update(body);
    return response;
  }

  @Get('/')
  async getAllGoals() {
    const response = await this.goalService.getAll();
    return response;
  }
}
