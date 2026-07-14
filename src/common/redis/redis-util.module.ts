import { Global, Module } from '@nestjs/common';
import { RedisConModule } from './redis-con.module';
import { RedisCacheService } from './redis-cach.service';
import { RedisLock } from './redis.lock';

@Global()
@Module({
  imports: [RedisConModule],
  providers: [RedisCacheService, RedisLock],
  exports: [RedisConModule, RedisCacheService, RedisLock],
})
export class RedisUtilModule {}
