import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private readonly service: GamificationService) {}

  @Get('points')
  @ApiOperation({ summary: 'Get user points, level, streak' })
  async getPoints(@Request() req: any) {
    return { success: true, data: await this.service.getPoints(req.user.sub) };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get point transaction history' })
  async getTransactions(@Request() req: any, @Query() query: any) {
    const result = await this.service.getTransactions(req.user.sub, query);
    return { success: true, ...result };
  }

  @Post('unlock')
  @ApiOperation({ summary: 'Unlock content with points' })
  async unlock(@Body() body: { entityType: string; entityId: string; pointCost: number }, @Request() req: any) {
    const points = await this.service.spendPoints(req.user.sub, body.pointCost, 'unlock_content', body.entityType, body.entityId);
    return { success: true, data: { message: 'Unlocked', points } };
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  async getLeaderboard(@Request() req: any, @Query('limit') limit?: number) {
    const entries = await this.service.getLeaderboard(req.user.tenantId, limit);
    return { success: true, data: entries };
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get badges' })
  async getBadges(@Request() req: any) {
    return { success: true, data: await this.service.getBadges(req.user.tenantId) };
  }

  @Get('missions')
  @ApiOperation({ summary: 'Get daily missions' })
  async getMissions(@Request() req: any) {
    return { success: true, data: await this.service.getDailyMissions(req.user.sub) };
  }

  @Post('missions/:id/progress')
  @ApiOperation({ summary: 'Update mission progress' })
  async updateMission(@Param('id') id: string, @Body() body: { increment: number }) {
    return { success: true, data: await this.service.updateMissionProgress(id, body.increment) };
  }
}
