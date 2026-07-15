/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { REDIS_CLIENT } from '../common/redis/redis-con.module';
import { ESocketEvent } from '../utils/common.enum';
import { IClaims, INotification } from '../utils/common.interface';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import {
  DeleteNotificationDto,
  GetNotificationsDto,
  ReadNotificationDto,
  UnreadNotificationDto,
} from './common/websocket.dto';
import { userRoom } from './common/websocket.room';
import {
  readNotificationKey,
  unreadNotificationKey,
  userNotificationKey,
} from '../common/redis/redis.keys';

function compareStreamId(a: string, b: string): number {
  const [aMs, aSeq] = a.split('-').map(Number);
  const [bMs, bSeq] = b.split('-').map(Number);
  if (aMs !== bMs) return aMs - bMs;
  return (aSeq ?? 0) - (bSeq ?? 0);
}

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);
  private server: Server;

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  setServer(server: Server): void {
    this.server = server;
  }

  getServer(): Server {
    return this.server;
  }

  // async handleConnection(client: Socket): Promise<void> {
  //   try {
  //     const bearer = client?.handshake?.auth?.access_token as string;
  //     let decoded: IClaims | null = null;

  //     try {
  //       decoded = this.authService.verifyToken(bearer);
  //     } catch {
  //       decoded = this.authService.decodeToken(bearer);
  //     }

  //     if (!decoded?.id) throw new Error('invalid token claims');

  //     client.data = decoded;
  //     await client.join(userRoom(decoded.id));
  //     await this.trimNotifications(client);
  //     client.emit(ESocketEvent.ConnectionStatus, { code: 0 });
  //   } catch (error: unknown) {
  //     const msg = error instanceof Error ? error.message : String(error);
  //     this.logger.warn(`handleConnection failed: ${msg}`);
  //     client.emit(ESocketEvent.ConnectionStatus, { code: 1 });
  //     client.disconnect();
  //   }
  // }
  async handleConnection(client: Socket): Promise<void> {
    try {
      const bearer = client?.handshake?.auth?.accessToken as string;
      let decoded: IClaims | null = null;

      try {
        decoded = this.authService.verifyToken(bearer);
      } catch {
        decoded = this.authService.decodeToken(bearer);
      }

      if (!decoded?.id) throw new Error('invalid token claims');

      client.data = decoded;
      await client.join(userRoom(decoded.id));
      await this.trimNotifications(client);
      client.emit(ESocketEvent.ConnectionStatus, { code: 0 });
      this.logger.log(
        `client connected and joined room: ${userRoom(decoded.id)}`,
      ); // ← add this one line
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`handleConnection failed: ${msg}`);
      client.emit(ESocketEvent.ConnectionStatus, { code: 1 });
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket): void {
    const user = client?.data as IClaims;
    this.logger.log(`client disconnected: user ${user?.id ?? 'unknown'}`);
  }

  async getNotificationsCount(client: Socket): Promise<{ count: number }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { count: 0 };

      const noticeKey = userNotificationKey(user.id);
      const readKey = readNotificationKey(user.id);
      const unreadKey = unreadNotificationKey(user.id);

      const pipeline = this.redis.pipeline();
      pipeline.hgetall(readKey);
      pipeline.hgetall(unreadKey);
      const result = await pipeline.exec();

      const read = (result?.[0]?.[1] as Record<string, string>) ?? {};
      const unread = (result?.[1]?.[1] as Record<string, string>) ?? {};
      const readAll = read?.read_all ?? null;

      let cursor = readAll ? `(${readAll}` : '-';
      let more = true;
      let count = 0;
      const pageSize = 100;

      while (more) {
        const page = await this.redis.xrange(
          noticeKey,
          cursor,
          '+',
          'COUNT',
          pageSize,
        );
        if (!page.length) break;

        for (const [id] of page) {
          if (!read?.[id] && id !== readAll) count++;
        }

        cursor = `(${page[page.length - 1][0]}`;
        more = page.length === pageSize;
      }

      if (unread && Object.keys(unread).length) {
        for (const id of Object.keys(unread)) {
          if (compareStreamId(id, readAll ?? '0-0') <= 0) count++;
        }
      }

      return { count };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`getNotificationsCount failed: ${msg}`);
      return { count: 0 };
    }
  }

  async getNotifications(
    client: Socket,
    dto: GetNotificationsDto,
  ): Promise<{ notifications: unknown[]; stream_id: string | null }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { notifications: [], stream_id: null };

      const noticeKey = userNotificationKey(user.id);
      const start =
        dto?.stream_id && dto.stream_id.includes('-')
          ? `(${dto.stream_id}`
          : '+';
      const data = await this.redis.xrevrange(
        noticeKey,
        start,
        '-',
        'COUNT',
        dto?.limit ?? 100,
      );

      let last: string | null = null;
      const notifications: unknown[] = [];

      if (data?.length) {
        const readKey = readNotificationKey(user.id);
        const unreadKey = unreadNotificationKey(user.id);

        const pipeline = this.redis.pipeline();
        pipeline.hgetall(readKey);
        pipeline.hgetall(unreadKey);
        const result = await pipeline.exec();

        const read = (result?.[0]?.[1] as Record<string, string>) ?? {};
        const unread = (result?.[1]?.[1] as Record<string, string>) ?? {};
        const readAll = read?.read_all ?? null;

        for (const [id, fields] of data) {
          if (!fields?.length) continue;

          const entry: Record<string, unknown> = {};
          for (let i = 0; i < fields.length; i += 2) {
            entry[fields[i]] = fields[i + 1];
          }

          entry.read = 0;
          if (readAll && compareStreamId(id, readAll) <= 0) entry.read = 1;
          if (read?.[id]) entry.read = 1;
          if (unread?.[id]) entry.read = 0;

          last = id;
          notifications.push({ stream_id: id, ...entry });
        }
      }

      return { notifications, stream_id: last };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`getNotifications failed: ${msg}`);
      return { notifications: [], stream_id: null };
    }
  }

  async readNotification(
    client: Socket,
    dto: ReadNotificationDto,
  ): Promise<{ code: number }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { code: 1 };

      const readKey = readNotificationKey(user.id);
      const unreadKey = unreadNotificationKey(user.id);
      const pipeline = this.redis.pipeline();

      for (const id of dto?.stream_id ?? []) {
        if (id?.includes('-')) {
          pipeline.hset(readKey, id, '1');
          pipeline.hdel(unreadKey, id);
        }
      }

      if (pipeline.length) await pipeline.exec();
      return { code: 0 };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`readNotification failed: ${msg}`);
      return { code: 1 };
    }
  }

  async readAllNotifications(client: Socket): Promise<{ code: number }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { code: 1 };

      const noticeKey = userNotificationKey(user.id);
      const data = await this.redis.xrevrange(noticeKey, '+', '-', 'COUNT', 1);

      if (data?.length) {
        const [id] = data[0];
        if (id?.includes('-')) {
          const readKey = readNotificationKey(user.id);
          const unreadKey = unreadNotificationKey(user.id);
          const pipeline = this.redis.pipeline();
          pipeline.del(readKey);
          pipeline.del(unreadKey);
          pipeline.hset(readKey, 'read_all', id);
          await pipeline.exec();
        }
      }

      return { code: 0 };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`readAllNotifications failed: ${msg}`);
      return { code: 1 };
    }
  }

  async unreadNotification(
    client: Socket,
    dto: UnreadNotificationDto,
  ): Promise<{ code: number }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { code: 1 };

      const readKey = readNotificationKey(user.id);
      const unreadKey = unreadNotificationKey(user.id);
      const pipeline = this.redis.pipeline();

      for (const id of dto?.stream_id ?? []) {
        if (id?.includes('-')) {
          pipeline.hset(unreadKey, id, '1');
          pipeline.hdel(readKey, id);
        }
      }

      if (pipeline.length) await pipeline.exec();
      return { code: 0 };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`unreadNotification failed: ${msg}`);
      return { code: 1 };
    }
  }

  async unreadAllNotifications(client: Socket): Promise<{ code: number }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { code: 1 };

      const readKey = readNotificationKey(user.id);
      const unreadKey = unreadNotificationKey(user.id);
      const pipeline = this.redis.pipeline();
      pipeline.del(readKey);
      pipeline.del(unreadKey);
      await pipeline.exec();
      return { code: 0 };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`unreadAllNotifications failed: ${msg}`);
      return { code: 1 };
    }
  }

  async deleteNotification(
    client: Socket,
    dto: DeleteNotificationDto,
  ): Promise<{ code: number }> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return { code: 1 };

      const noticeKey = userNotificationKey(user.id);
      const readKey = readNotificationKey(user.id);
      const unreadKey = unreadNotificationKey(user.id);
      const pipeline = this.redis.pipeline();

      for (const id of dto?.stream_id ?? []) {
        if (id?.includes('-')) {
          pipeline.xdel(noticeKey, id);
          pipeline.hdel(readKey, id);
          pipeline.hdel(unreadKey, id);
        }
      }

      if (pipeline.length) await pipeline.exec();
      return { code: 0 };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`deleteNotification failed: ${msg}`);
      return { code: 1 };
    }
  }

  async trimNotifications(client: Socket): Promise<void> {
    try {
      const user = client?.data as IClaims;
      if (!user?.id) return;

      const noticeKey = userNotificationKey(user.id);
      const cutoff = Date.now() - 31 * 24 * 60 * 60 * 1000;
      await this.redis.xtrim(noticeKey, 'MINID', `${cutoff}-0`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`trimNotifications failed: ${msg}`);
    }
  }

  async publishNotification(
    userId: number | string,
    notification: Omit<INotification, 'read'>,
  ): Promise<void> {
    try {
      const noticeKey = userNotificationKey(userId);
      const fields: string[] = [];

      for (const [key, value] of Object.entries(notification)) {
        fields.push(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        );
      }

      await this.redis.xadd(noticeKey, '*', ...fields);

      if (this.server) {
        this.server
          .to(userRoom(userId))
          .emit(ESocketEvent.NewNotification, notification);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`publishNotification failed: ${msg}`);
    }
  }
}
