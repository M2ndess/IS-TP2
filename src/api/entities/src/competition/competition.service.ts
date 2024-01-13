import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

interface Competition {
  id: number;
}

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Competition[]> {
    return this.prisma.competition.findMany();
  }

  async findOne(id: number): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return competition;
  }

  async create(data: Prisma.CompetitionCreateInput): Promise<Competition> {
    return this.prisma.competition.create({ data });
  }

  async update(
    id: number,
    data: Prisma.CompetitionUpdateInput,
  ): Promise<Competition> {
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

  async delete(id: number): Promise<void> {
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
