import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

interface Competition {
  id: string;
}

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Competition[]> {
    const competitions = await this.prisma.competition.findMany();
    return competitions.map((competition) => ({
      id: competition.id.toString(), // Convert id to string here
    }));
  }

  async findOne(id: string): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return competition;
  }

  async create(data: Prisma.CompetitionCreateInput): Promise<Competition> {
    const createdCompetition = await this.prisma.competition.create({ data });
    return {
      id: createdCompetition.id.toString(), // Convert id to string here
    };
  }

  async update(
    id: string,
    data: Prisma.CompetitionUpdateInput,
  ): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    const updatedCompetition = await this.prisma.competition.update({
      where: { id },
      data,
    });

    return {
      id: updatedCompetition.id.toString(), // Convert id to string here
    };
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
