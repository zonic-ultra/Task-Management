import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsEnum, IsString } from 'class-validator';
import { ETasksStatus } from 'src/common/types.common';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(ETasksStatus)
  status?: ETasksStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateTaskStatusDto {
  @IsEnum(ETasksStatus)
  status: ETasksStatus;
}
