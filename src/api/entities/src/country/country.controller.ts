import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.countryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.countryService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<any> {
    return this.countryService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any): Promise<any> {
    return this.countryService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.countryService.delete(id);
  }
}
