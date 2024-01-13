import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PlayerService {
  private prisma = new PrismaClient();

  async findAll(): Promise<any[]> {
    return this.prisma.player.findMany();
  }

  async findOne(id: string): Promise<any> {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  async create(data: any): Promise<any> {
    return this.prisma.player.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return this.prisma.player.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    await this.prisma.player.delete({
      where: { id },
    });
  }
}
