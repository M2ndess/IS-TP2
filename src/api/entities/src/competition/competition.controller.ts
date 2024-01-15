import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  async findAll(): Promise<any[]> {
    const competitions = await this.competitionService.findAll();
    return competitions.map((competition) => ({ ...competition }));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<any> {
    const competition = await this.competitionService.findOne(id);
    return { ...competition };
  }

  @Post()
  async create(@Body() data: any): Promise<any> {
    const competition = await this.competitionService.create(data);
    return { ...competition };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: any,
  ): Promise<any> {
    const competition = await this.competitionService.update(id, data);
    return { ...competition };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.competitionService.delete(id);
  }
}
