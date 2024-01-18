import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Country } from '@prisma/client';
import { omit } from 'lodash';

interface CreateCountryInput {
  name: string;
  latitude: string;
  longitude: string;
}

@Injectable()
export class CountryService {
  private prisma = new PrismaClient();

  async create(data: CreateCountryInput): Promise<Country> {
    const createData = omit(data, ['id']);

    return this.prisma.country.create({
      data: createData,
    });
  }

  async getById(id: string): Promise<Country | null> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }

    return country;
  }

  async findAll(): Promise<Country[]> {
    return this.prisma.country.findMany();
  }
}
