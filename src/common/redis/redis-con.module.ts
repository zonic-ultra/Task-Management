// import {
//   BeforeApplicationShutdown,
//   Global,
//   Inject,
//   Logger,
//   Module,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Redis from 'ioredis';

// export const REDIS_CLIENT = 'REDIS_CLIENT';

// @Global()
// @Module({
//   providers: [
//     {
//       provide: REDIS_CLIENT,
//       inject: [ConfigService],
//       useFactory: (config: ConfigService): Redis => {
//         const logger = new Logger('RedisClient');

//         const redis = new Redis({
//           host: config.get<string>('REDIS_HOST'),
//           port: config.get<number>('REDIS_PORT'),
//           username: config.get<string>('REDIS_USERNAME') || undefined,
//           password: config.get<string>('REDIS_PASSWORD') || undefined,
//           connectTimeout: 10000,
//           enableReadyCheck: true,
//           maxRetriesPerRequest: null,
//           retryStrategy: (attempt: number) => {
//             const delay = Math.min(attempt * 100, 2000);
//             logger.warn(`Reconnect attempt ${attempt} in ${delay}ms`);
//             return delay;
//           },
//         });

//         redis.on('ready', () => logger.log('connection established'));
//         redis.on('close', () => logger.warn('connection closed'));
//         redis.on('error', (error: unknown) => {
//           const msg = error instanceof Error ? error.message : String(error);
//           logger.error(`redis error: ${msg}`);
//         });

//         return redis;
//       },
//     },
//   ],
//   exports: [REDIS_CLIENT],
// })
// export class RedisConModule implements BeforeApplicationShutdown {
//   private readonly logger = new Logger(RedisConModule.name);

//   constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

//   async beforeApplicationShutdown(): Promise<void> {
//     try {
//       await this.redis.quit();
//     } catch (error: unknown) {
//       const msg = error instanceof Error ? error.message : String(error);
//       this.logger.warn(`error during redis shutdown: ${msg}`);
//     }
//   }
// }

import {
  BeforeApplicationShutdown,
  Global,
  Inject,
  Logger,
  Module,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { notificationBroadcast } from './redis.channels';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const REDIS_SUBSCRIBER = 'REDIS_SUBSCRIBER';

const CHANNELS: string[] = [notificationBroadcast];

function createRedisClient(config: ConfigService, name: string): Redis {
  const logger = new Logger(name);

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
  redis.on('reconnecting', (delay: number) => {
    logger.warn(`reconnecting in ${delay} ms`);
  });

  return redis;
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<Redis> => {
        const redis = createRedisClient(config, 'RedisClient');
        await redis.ping();
        return redis;
      },
    },
    {
      provide: REDIS_SUBSCRIBER,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<Redis> => {
        const subscriber = createRedisClient(config, 'RedisSubscriber');
        const logger = new Logger('RedisSubscriber');

        const subscribeToChannels = async (): Promise<void> => {
          for (const channel of CHANNELS) {
            try {
              await subscriber.subscribe(channel);
              logger.log(`subscribed to channel: ${channel}`);
            } catch (error: unknown) {
              const msg =
                error instanceof Error ? error.message : String(error);
              logger.error(`failed to subscribe to ${channel}: ${msg}`);
            }
          }
        };

        subscriber.on('ready', () => {
          void subscribeToChannels();
        });

        await subscriber.ping();
        return subscriber;
      },
    },
  ],
  exports: [REDIS_CLIENT, REDIS_SUBSCRIBER],
})
export class RedisConModule implements BeforeApplicationShutdown {
  private readonly logger = new Logger(RedisConModule.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis,
  ) {}

  async beforeApplicationShutdown(): Promise<void> {
    try {
      await this.redis.quit();
      await this.subscriber.quit();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`error during redis shutdown: ${msg}`);
    }
  }
}
