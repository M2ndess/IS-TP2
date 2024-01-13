import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.playerService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.playerService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.playerService.delete(id);
  }
}
