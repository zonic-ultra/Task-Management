/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis-con.module';
import {
  readNotificationKey,
  unreadNotificationKey,
  userNotificationKey,
} from '../../common/redis/redis.keys';

function compareStreamId(a: string, b: string): number {
  const [aMs, aSeq] = a.split('-').map(Number);
  const [bMs, bSeq] = b.split('-').map(Number);
  if (aMs !== bMs) return aMs - bMs;
  return (aSeq ?? 0) - (bSeq ?? 0);
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getCount(userId: number): Promise<{ count: number }> {
    try {
      const noticeKey = userNotificationKey(userId);
      const readKey = readNotificationKey(userId);
      const unreadKey = unreadNotificationKey(userId);

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
        const page = await this.redis.xrange(noticeKey, cursor, '+', 'COUNT', pageSize);
        if (!page.length) break;

        for (const [id] of page) {
          if (!read?.[id] && id !== readAll) count++;
        }

        cursor = `(${page[page.length - 1][0]}`;
        more = page.length === pageSize;
      }

      if (Object.keys(unread).length) {
        for (const id of Object.keys(unread)) {
          if (compareStreamId(id, readAll ?? '0-0') <= 0) count++;
        }
      }

      return { count };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`getCount failed: ${msg}`);
      return { count: 0 };
    }
  }

  async getAll(
    userId: number,
    limit = 20,
    stream_id?: string,
  ): Promise<{ notifications: unknown[]; stream_id: string | null }> {
    try {
      const noticeKey = userNotificationKey(userId);
      const start = stream_id?.includes('-') ? `(${stream_id}` : '+';
      const data = await this.redis.xrevrange(noticeKey, start, '-', 'COUNT', limit);

      let last: string | null = null;
      const notifications: unknown[] = [];

      if (data?.length) {
        const readKey = readNotificationKey(userId);
        const unreadKey = unreadNotificationKey(userId);

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
      this.logger.warn(`getAll failed: ${msg}`);
      return { notifications: [], stream_id: null };
    }
  }

  async markRead(userId: number, streamIds: string[]): Promise<{ code: number }> {
    try {
      const readKey = readNotificationKey(userId);
      const unreadKey = unreadNotificationKey(userId);
      const pipeline = this.redis.pipeline();

      for (const id of streamIds) {
        if (id?.includes('-')) {
          pipeline.hset(readKey, id, '1');
          pipeline.hdel(unreadKey, id);
        }
      }

      if (pipeline.length) await pipeline.exec();
      return { code: 0 };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`markRead failed: ${msg}`);
      return { code: 1 };
    }
  }

  async markAllRead(userId: number): Promise<{ code: number }> {
    try {
      const noticeKey = userNotificationKey(userId);
      const data = await this.redis.xrevrange(noticeKey, '+', '-', 'COUNT', 1);

      if (data?.length) {
        const [id] = data[0];
        if (id?.includes('-')) {
          const readKey = readNotificationKey(userId);
          const unreadKey = unreadNotificationKey(userId);
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
      this.logger.warn(`markAllRead failed: ${msg}`);
      return { code: 1 };
    }
  }

  async delete(userId: number, streamIds: string[]): Promise<{ code: number }> {
    try {
      const noticeKey = userNotificationKey(userId);
      const readKey = readNotificationKey(userId);
      const unreadKey = unreadNotificationKey(userId);
      const pipeline = this.redis.pipeline();

      for (const id of streamIds) {
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
      this.logger.warn(`delete failed: ${msg}`);
      return { code: 1 };
    }
  }
}
