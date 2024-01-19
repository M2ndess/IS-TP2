import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PlayersService {
  private prisma = new PrismaClient();

  async findAll(): Promise<any[]> {
    return this.prisma.players.findMany();
  }

  async findOne(id: string): Promise<any> {
    const player = await this.prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  async create(data: any): Promise<any> {
    return this.prisma.players.create({
      data: {
        id: data.ID,
        name: data.Name,
        last_name: data.LastName,
        gender: data.Gender,
        age: data.Age,
        country: data.Country,
        competitor_id: data.CompetitorID,
        competitor_name: data.CompetitorName,
        height: data.Height,
        weight: data.Weight,
        overall_rank: data.OverallRank,
        overall_score: data.OverallScore,
        year: data.Year,
        competition: data.Competition,
        height_cm: data.HeightCm,
        weight_kg: data.WeightKg,
        team_id: data.TeamID,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const player = await this.prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return this.prisma.players.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const player = await this.prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    await this.prisma.players.delete({
      where: { id },
    });
  }
}
