import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayersService } from '../players/players.service';

@Module({
  imports: [PrismaModule],
  providers: [TeamService, PlayersService],
  controllers: [TeamController],
})
export class TeamModule {}
