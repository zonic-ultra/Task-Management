import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { GetUser } from '../auth/get-user.decorators';
import { User } from '../../common/entities/user.entity';
import { RolesGuard } from '../../common/gaurds/roles.guard';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll(
    @GetUser() user: User,
    @Query('limit') limit?: number,
    @Query('stream_id') stream_id?: string,
  ) {
    return this.notificationsService.getAll(user.id, limit ? Number(limit) : 20, stream_id);
  }

  @Get('count')
  getCount(@GetUser() user: User) {
    return this.notificationsService.getCount(user.id);
  }

  @Patch('read')
  markRead(@GetUser() user: User, @Body() body: { stream_id: string[] }) {
    return this.notificationsService.markRead(user.id, body.stream_id);
  }

  @Patch('read-all')
  markAllRead(@GetUser() user: User) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Delete()
  delete(@GetUser() user: User, @Body() body: { stream_id: string[] }) {
    return this.notificationsService.delete(user.id, body.stream_id);
  }
}
