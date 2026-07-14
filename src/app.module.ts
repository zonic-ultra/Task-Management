import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsocketModule } from './websocket/websocket.module';
import { RedisUtilModule } from './common/redis/redis-util.module';
import { MembersModule } from './modules/members/members.module';
import { SubtasksModule } from './modules/subtasks/subtasks.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './common/database/database.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClaimsGuard } from './common/gaurds/claims.guard';
import { RolesGuard } from './common/gaurds/roles.guard';
import { JwtAuthGuard } from './common/gaurds/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggingInterceptor } from './common/logging.interceptor';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as AppScheduleModule } from './schedule/schedule.module';
import { configValidationSchema } from './common/database/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
      cache: true,
      expandVariables: true,
    }),
    RedisUtilModule,
    WebsocketModule,
    NotificationsModule,
    MembersModule,
    SubtasksModule,
    UsersModule,
    DatabaseModule,
    ProjectsModule,
    TasksModule,
    HealthModule,
    AuthModule,
    //   TasksModule,
    //   // TypeOrmModule.forRoot({
    //   //   type: 'mysql',
    //   //   autoLoadEntities: true,
    //   //   synchronize: true,
    //   // }),
    //   TypeOrmModule.forRootAsync({
    // imports: [
    //   ConfigModule,
    ThrottlerModule.forRoot({
      throttlers: [
        // {
        //   ttl: 10000,
        //   limit: 5,
        // },
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),

    AppScheduleModule,
    ScheduleModule.forRoot(),
    // ],
    //     inject: [ConfigService],
    //     useFactory: (configService: ConfigService) => ({
    //       type: 'mysql',
    //       autoLoadEntities: true,
    //       synchronize: true,
    //       host: configService.get('DB_HOST'),
    //       port: configService.get('DB_PORT'),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_DATABASE'),
    //       entities: [Task, User],
    //     }),
    //   }),
    //   AuthModule,
    //   HealthModule,
  ],
  providers: [
    //Rate limiter....
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ClaimsGuard,
    },
    // logging
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
