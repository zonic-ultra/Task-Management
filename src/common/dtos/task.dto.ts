import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ETasksStatus } from '../enums/enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ETasksStatus)
  @IsOptional()
  priority?: ETasksStatus;

  @IsUUID()
  @IsOptional()
  assignee_id?: string;

  @IsDateString()
  @IsOptional()
  due_date?: Date;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ETasksStatus)
  @IsOptional()
  status?: ETasksStatus;

  @IsEnum(ETasksStatus)
  @IsOptional()
  priority?: ETasksStatus;

  @IsUUID()
  @IsOptional()
  assignee_id?: string;

  @IsDateString()
  @IsOptional()
  due_date?: Date;
}

export class UpdateTaskStatusDto {
  @IsEnum(ETasksStatus)
  @IsNotEmpty()
  status: ETasksStatus;
}

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(ETasksStatus)
  status?: ETasksStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
