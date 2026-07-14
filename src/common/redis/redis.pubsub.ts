/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from './redis-con.module';
import { notificationBroadcast } from './redis.channels';
import { WebsocketService } from '../../modules/websocket/websocket.service';

@Injectable()
export class RedisPubSub implements OnApplicationBootstrap {
  private readonly logger = new Logger(RedisPubSub.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis,
    private readonly websocket: WebsocketService,
  ) {}

  onApplicationBootstrap() {
    this.subscriber.on('message', (channel: string, message: string) => {
      if (channel === notificationBroadcast) {
        this.handleBroadcast(message);
      }
    });
  }

  publish(channel: string, message: unknown) {
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    this.redis.publish(channel, payload).catch((error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`publish error on channel ${channel}: ${msg}`);
    });
  }

  private handleBroadcast(message: string) {
    try {
      this.websocket.broadcast('redis:notification', message);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`handleBroadcast error: ${msg}`);
    }
  }
}
