import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

interface Country {
  id: string;
}

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Country[]> {
    return this.prisma.country.findMany();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async create(data: any): Promise<any> {
    return this.prisma.country.create({
      data: {
        id: data.ID,
        name: data.Name,
        coords: null,
      },
    });
  }

  async update(id: string, data: Prisma.CountryUpdateInput): Promise<Country> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return this.prisma.country.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    await this.prisma.country.delete({
      where: { id },
    });
  }
}
