import { Global, Module } from '@nestjs/common';
import { RedisConModule } from './redis-con.module';
import { RedisCacheService } from './redis-cach.service';

@Global()
@Module({
  imports: [RedisConModule],
  providers: [RedisCacheService],
  exports: [RedisConModule, RedisCacheService],
})
export class RedisUtilModule {}
