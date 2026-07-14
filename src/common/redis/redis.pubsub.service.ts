// import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { errorLog } from '../elastic/elastic.logger.js';
// import { extractError, safeString } from '../../utils/common.helper.js';
// import Redis from 'ioredis';
// import { WebsocketService } from '../../modules/websocket/websocket.service.js';
// import { REDIS_CLIENT, REDIS_SUBSCRIBER } from './redis-con.module';
// import { notificationBroadcast } from './redis.channels.js';
// import { RedisLock } from './redis.lock';

// @Injectable()
// export class RedisPubSub implements OnApplicationBootstrap {
//   constructor(
//     private readonly redisLock: RedisLock,
//     private readonly websocket: WebsocketService,

//     @Inject(REDIS_CLIENT) private readonly redis: Redis,
//     @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis,
//   ) {}

//   onApplicationBootstrap() {
//     this.subscribeChannel();
//   }

//   publish(channel: string, message: string) {
//     try {
//       this.redis.publish(channel, message);
//     } catch (error) {
//       const log = {
//         publish_error: safeString({ channel, message }),
//         extracted_error: extractError(error),
//       };
//       errorLog('CATCH: Redis - publish', log);
//     }
//   }

//   async subscribeChannel() {
//     this.subscriber.on('message', (channel: string, message: string) => {
//       if (channel === notificationBroadcast) {
//         this.handleBroadcast(message);
//       }
//     });
//   }

//   async handleBroadcast(message: string) {
//     try {
//       const server = (await this.websocket.getServer()) as unknown;

//       if (!server) return;

//       server.emit('redis:notification', safeString(message));
//     } catch (error) {
//       errorLog('CATCH: Redis - handleBroadcast', {
//         catch_error: extractError(error),
//       });
//     }
//   }
// }

import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from './redis-con.module';
import { notificationBroadcast } from './redis.channels';
import { WebsocketService } from '../../websocket/websocket.service';
import { userRoom } from '../../websocket/common/websocket.room';

export interface INotificationPayload {
  user_id: number;
  type: 'TASK_ASSIGNED' | 'TASK_REASSIGNED';
  task_id: number;
  message: string;
  created_at: string;
}

@Injectable()
export class RedisPubSub implements OnApplicationBootstrap {
  private readonly logger = new Logger(RedisPubSub.name);

  constructor(
    private readonly websocket: WebsocketService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis,
  ) {}

  onApplicationBootstrap() {
    this.subscribeChannel();
  }

  publish(payload: INotificationPayload): void {
    try {
      this.redis.publish(notificationBroadcast, JSON.stringify(payload));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`publish failed: ${msg}`);
    }
  }

  private subscribeChannel(): void {
    this.subscriber.on('message', (channel: string, message: string) => {
      if (channel === notificationBroadcast) {
        this.handleBroadcast(message);
      }
    });
  }

  private handleBroadcast(message: string): void {
    try {
      const server = this.websocket.getServer();
      if (!server) return;

      const data: INotificationPayload = JSON.parse(message);
      if (!data?.user_id) return;

      server.to(userRoom(data.user_id)).emit('notification', data);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`handleBroadcast failed: ${msg}`);
    }
  }
}
