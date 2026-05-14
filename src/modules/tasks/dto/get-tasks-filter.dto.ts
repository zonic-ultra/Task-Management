import { IsEnum, IsString } from 'class-validator';
import { TasksStatus } from '../tasks.model';
import { Optional } from '@nestjs/common';

export class GetTasksFilterDto {
  @Optional()
  @IsEnum(TasksStatus)
  status?: TasksStatus;

  @Optional()
  @IsString()
  search?: string;
}
