import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.teamService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.teamService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any) {
    return this.teamService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.teamService.delete(id);
  }
}
