import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { RolesGuard } from 'src/common/gaurds/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRole } from 'src/common/enums/enum';
import { Public } from 'src/common/decorators/public.decorator';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('status')
  @Public()
  getStatus() {
    return this.scheduleService.getJobStatus();
  }

  @Post('trigger')
  @Public()
  triggerJob() {
    this.scheduleService.handleCron();
    return { message: 'Schedule job triggered manually' };
  }
}
