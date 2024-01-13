import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PlayersService {
  private prisma = new PrismaClient();

  async findAll(): Promise<any[]> {
    return this.prisma.players.findMany();
  }

  async findOne(id: number): Promise<any> {
    const player = await this.prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  async create(data: any): Promise<any> {
    return this.prisma.players.create({ data });
  }

  async update(id: number, data: any): Promise<any> {
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

  async delete(id: number): Promise<void> {
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
