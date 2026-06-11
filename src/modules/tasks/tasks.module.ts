import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from '../../common/entities/task.entity';
import { AuthModule } from '../auth/auth.module';
import { Project } from 'src/common/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks, Project], 'main_repo'),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
