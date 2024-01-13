import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  async findAll() {
    return this.competitionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.competitionService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.competitionService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.competitionService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.competitionService.delete(id);
  }
}
