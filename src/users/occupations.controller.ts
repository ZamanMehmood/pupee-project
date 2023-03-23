import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  CreateOccupationDto,
  UpdateOccupationDto,
} from './dtos/occupation.dto';
import { OccupationsService } from './occupations.service';

@Controller('occupations')
export class OccupationsController {
  constructor(private occupationsService: OccupationsService) {}

  @Post('/')
  async createOccupation(@Body() body: CreateOccupationDto) {
    const occupation = await this.occupationsService.create(body.name);
    return occupation;
  }

  @Put('/')
  async updateOccupation(@Body() body: UpdateOccupationDto) {
    const occupation = await this.occupationsService.update(body);
    return occupation;
  }

  @Get('/')
  async getAllOccupation() {
    const occupations = await this.occupationsService.getAll();
    return occupations;
  }
}
