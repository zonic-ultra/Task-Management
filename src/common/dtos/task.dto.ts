import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ETaskPriority, ETasksStatus } from '../enums/enum';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(ETaskPriority)
  @IsOptional()
  priority: ETaskPriority;

  @IsOptional()
  assignee_id: number;

  @IsOptional()
  @Type(() => Date) // ← replace @IsDateString() with this
  due_date?: Date;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(ETasksStatus)
  @IsOptional()
  status: ETasksStatus;

  @IsEnum(ETaskPriority)
  @IsOptional()
  priority: ETaskPriority;

  @IsOptional()
  assignee_id: number;

  @IsDateString()
  @IsOptional()
  due_date: Date;
}

export class UpdateTaskStatusDto {
  @IsEnum(ETasksStatus)
  @IsNotEmpty()
  status: ETasksStatus;
}

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(ETasksStatus)
  status: ETasksStatus;

  @IsOptional()
  @IsString()
  search: string;
}
