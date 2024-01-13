import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TeamService {
  private prisma = new PrismaClient();

  async findAll(): Promise<any[]> {
    return this.prisma.team.findMany();
  }

  async findOne(id: number): Promise<any> {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async create(data: any): Promise<any> {
    return this.prisma.team.create({ data });
  }

  async update(id: number, data: any): Promise<any> {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    await this.prisma.team.delete({
      where: { id },
    });
  }
}
