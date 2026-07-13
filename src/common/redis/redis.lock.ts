/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { REDIS_CLIENT } from './redis-con.module';

@Injectable()
export class RedisLock implements OnModuleDestroy {
  private single: Redlock;
  private multiple: Redlock;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    this.multiple = new Redlock([this.redis], {
      driftFactor: 0.01,
      retryCount: 25,
      retryDelay: 200,
      retryJitter: 200,
    });

    this.single = new Redlock([this.redis], {
      driftFactor: 0.01,
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0,
    });
  }

  onModuleDestroy() {
    try {
      this.single.quit();
      this.multiple.quit();
    } catch (error) {}
  }

  async multipleLock(resource: string, ttl: number) {
    try {
      return await this.multiple.acquire([resource], ttl);
    } catch (error) {
      return undefined;
    }
  }

  async singleLock(resource: string, ttl: number) {
    try {
      return await this.single.acquire([resource], ttl);
    } catch (error) {
      return undefined;
    }
  }

  async releaseLock(lock: Lock) {
    try {
      await lock.release();
    } catch (error) {
      return undefined;
    }
  }

  generateLock(resource: string, unique: string | number) {
    const environment = process.env.STAGE ?? 'dev';
    return `${environment}:lock:${resource}:${unique}`;
  }
}
