import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm'; // ← add
import { DataSource } from 'typeorm'; // ← add
import { Public } from 'src/common/decorators/public.decorator';
import { HealthLoggingInterceptor } from 'src/common/permissions/db.logging';

@Controller('health')
@UseInterceptors(HealthLoggingInterceptor)
@ApiBearerAuth()
@SkipThrottle({ default: false })
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService,
    @InjectDataSource('main_repo') // ← add
    private dataSource: DataSource, // ← add
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  check() {
    return this.health.check([
      () =>
        this.db.pingCheck(this.configService.get('DB_DATABASE') ?? 'System', {
          connection: this.dataSource,
        }),
    ]);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async logHealthStatus() {
    const result = await this.health.check([
      () =>
        this.db.pingCheck(this.configService.get('DB_DATABASE') ?? 'System', {
          connection: this.dataSource,
        }),
    ]);
    this.logger.log(`Health status: ${result.status}`);
  }
}
