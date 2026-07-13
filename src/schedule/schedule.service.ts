import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger('ScheduleService');
  private lastRun: Date | null = null;

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.lastRun = new Date();
    this.logger.debug(`Job status: ${JSON.stringify(this.getJobStatus())}`);
  }

  getJobStatus() {
    return {
      job: 'handleCron',
      interval: CronExpression.EVERY_30_SECONDS,
      lastRun: this.lastRun,
    };
  }
}
