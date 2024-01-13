import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CountryService {
  private prisma = new PrismaClient();

  async findAll(): Promise<any[]> {
    return this.prisma.country.findMany();
  }

  async findOne(id: string): Promise<any> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async create(data: any): Promise<any> {
    return this.prisma.country.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
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
