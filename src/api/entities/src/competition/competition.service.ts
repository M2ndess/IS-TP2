import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

interface Competition {
  id: string;
  year: string;
  competition_name: string;
}

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Competition[]> {
    const competitions = await this.prisma.competition.findMany();
    return competitions.map((competition) => ({
      id: competition.id.toString(),
      year: competition.year,
      competition_name: competition.competition_name,
    }));
  }

  async findOne(id: string): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: Number(id) }, // Convert id to number before querying
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return {
      id: competition.id.toString(),
      year: competition.year,
      competition_name: competition.competition_name,
    };
  }

  async create(data: Prisma.CompetitionCreateInput): Promise<Competition> {
    const createdCompetition = await this.prisma.competition.create({ data });

    return {
      id: createdCompetition.id.toString(),
      year: createdCompetition.year,
      competition_name: createdCompetition.competition_name,
    };
  }

  async update(
    id: string,
    data: Prisma.CompetitionUpdateInput,
  ): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: Number(id) }, // Convert id to number before querying
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    const updatedCompetition = await this.prisma.competition.update({
      where: { id: Number(id) }, // Convert id to number before updating
      data,
    });

    return {
      id: updatedCompetition.id.toString(),
      year: updatedCompetition.year,
      competition_name: updatedCompetition.competition_name,
    };
  }

  async delete(id: string): Promise<void> {
    const competition = await this.prisma.competition.findUnique({
      where: { id: Number(id) }, // Convert id to number before querying
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    await this.prisma.competition.delete({
      where: { id: Number(id) }, // Convert id to number before deleting
    });
  }
}
