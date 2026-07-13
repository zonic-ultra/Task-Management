import {
  BeforeApplicationShutdown,
  Global,
  Inject,
  Logger,
  Module,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const logger = new Logger('RedisClient');

        const redis = new Redis({
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          username: config.get<string>('REDIS_USERNAME') || undefined,
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          connectTimeout: 10000,
          enableReadyCheck: true,
          maxRetriesPerRequest: null,
          retryStrategy: (attempt: number) => {
            const delay = Math.min(attempt * 100, 2000);
            logger.warn(`Reconnect attempt ${attempt} in ${delay}ms`);
            return delay;
          },
        });

        redis.on('ready', () => logger.log('connection established'));
        redis.on('close', () => logger.warn('connection closed'));
        redis.on('error', (error: unknown) => {
          const msg = error instanceof Error ? error.message : String(error);
          logger.error(`redis error: ${msg}`);
        });

        return redis;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisConModule implements BeforeApplicationShutdown {
  private readonly logger = new Logger(RedisConModule.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async beforeApplicationShutdown(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`error during redis shutdown: ${msg}`);
    }
  }
}
