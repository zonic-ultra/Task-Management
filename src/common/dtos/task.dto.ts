import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ETaskPriority, ETasksStatus } from '../enums/enum';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete API documentation',
    description: 'Title of the task',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Need to write detailed Swagger documentation for all endpoints',
    description: 'Detailed description of the task',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: ETaskPriority.HIGH,
    description: 'Priority level of the task',
    enum: ETaskPriority,
    required: false,
  })
  @IsEnum(ETaskPriority)
  @IsOptional()
  priority: ETaskPriority;

  @ApiProperty({
    example: 5,
    description: 'ID of the user assigned to this task',
    required: false,
  })
  @IsOptional()
  assignee_id: number;

  @ApiProperty({
    example: '2026-07-15T10:00:00Z',
    description: 'Due date for the task',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  due_date?: Date;
}

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Update project requirements',
    description: 'Updated title of the task',
    required: false,
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'Revised requirements after client feedback',
    description: 'Updated description of the task',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: ETasksStatus.IN_PROGRESS,
    description: 'Current status of the task',
    enum: ETasksStatus,
    required: false,
  })
  @IsEnum(ETasksStatus)
  @IsOptional()
  status: ETasksStatus;

  @ApiProperty({
    example: ETaskPriority.MEDIUM,
    description: 'Priority level of the task',
    enum: ETaskPriority,
    required: false,
  })
  @IsEnum(ETaskPriority)
  @IsOptional()
  priority: ETaskPriority;

  @ApiProperty({
    example: 7,
    description: 'ID of the assigned user',
    required: false,
  })
  @IsOptional()
  assignee_id: number;

  @ApiProperty({
    example: '2026-07-20T17:30:00Z',
    description: 'Due date for the task',
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  due_date: Date;
}

export class UpdateTaskStatusDto {
  @ApiProperty({
    example: ETasksStatus.DONE,
    description: 'New status for the task',
    enum: ETasksStatus,
  })
  @IsEnum(ETasksStatus)
  @IsNotEmpty()
  status: ETasksStatus;
}

export class GetTasksFilterDto {
  @ApiProperty({
    example: ETasksStatus.TODO,
    description: 'Filter tasks by status',
    enum: ETasksStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ETasksStatus)
  status: ETasksStatus;

  @ApiProperty({
    example: 'documentation',
    description: 'Search term to filter tasks',
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;
}
