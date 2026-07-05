import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { UserPoints } from './entities/user-points.entity';
import { PointTransaction } from './entities/point-transaction.entity';
import { Badge } from './entities/badge.entity';
import { DailyMission } from './entities/daily-mission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserPoints, PointTransaction, Badge, DailyMission]), AuthModule],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
