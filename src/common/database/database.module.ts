import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { Module } from '@nestjs/common';
import { configValidationSchema } from 'src/common/database/config.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Tasks } from '../entities/task.entity';
import { User } from 'src/common/entities/user.entity';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project.meber.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      name: 'main_repo',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        autoLoadEntities: true,
        synchronize: false,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Tasks, User, Project, ProjectMember],
        timezone: 'Z',
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
