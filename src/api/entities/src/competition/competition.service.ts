import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CompetitionService {
  private prisma = new PrismaClient();

  async findAll(): Promise<any[]> {
    return this.prisma.competition.findMany();
  }

  async findOne(id: string): Promise<any> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return competition;
  }

  async create(data: any): Promise<any> {
    return this.prisma.competition.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return this.prisma.competition.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    await this.prisma.competition.delete({
      where: { id },
    });
  }
}
