import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  async findAll(@Request() req: any, @Query() query: any) {
    const result = await this.service.findAll(req.user.sub, query);
    return { success: true, ...result };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread count' })
  async unreadCount(@Request() req: any) {
    const count = await this.service.getUnreadCount(req.user.sub);
    return { success: true, data: { count } };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Param('id') id: string) {
    return { success: true, data: await this.service.markAsRead(id) };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all as read' })
  async markAllRead(@Request() req: any) {
    await this.service.markAllAsRead(req.user.sub);
    return { success: true, data: { message: 'All marked as read' } };
  }
}
