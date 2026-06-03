import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { Task } from './modules/tasks/task.entity';
import { User } from './modules/auth/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { ClaimsGuard } from './common/gaurds/claims.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Task, User],
      }),
    }),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClaimsGuard,
    },
  ],
})
export class AppModule {}
