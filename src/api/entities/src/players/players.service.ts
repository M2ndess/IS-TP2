import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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
    data.id = data.id || String(uuidv4());
    return this.prisma.players.create({ data });
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
