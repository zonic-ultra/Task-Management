import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // ← add

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([], 'main_repo'), // ← add
  ],
  controllers: [HealthController],
})
export class HealthModule {}
