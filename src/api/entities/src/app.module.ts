import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamModule } from './team/team.module';
import { CompetitionModule } from './competition/competition.module';
import { CountryModule } from './country/country.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PlayersModule,
    TeamModule,
    CompetitionModule,
    CountryModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
