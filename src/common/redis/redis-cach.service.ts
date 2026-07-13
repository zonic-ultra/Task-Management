/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis-con.module';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.warn(`GET failed for key "${key}": ${error}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const plain = instanceToPlain(value);
      const payload = JSON.stringify(plain);
      if (ttlSeconds) {
        await this.redis.set(key, payload, 'EX', ttlSeconds);
      } else {
        await this.redis.set(key, payload);
      }
    } catch (error) {
      this.logger.warn(`SET failed for key "${key}": ${error}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn(`DEL failed for key "${key}": ${error}`);
    }
  }

  async delByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length) await this.redis.del(...keys);
    } catch (error) {
      this.logger.warn(`DEL by prefix failed for "${prefix}": ${error}`);
    }
  }
}
