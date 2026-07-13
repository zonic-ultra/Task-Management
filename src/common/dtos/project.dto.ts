import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EProjectStatus } from '../enums/enum';
import { IsCustomDate, IsFutureDate } from 'src/utils/common.helper';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({
    example: 1,
    description: 'Target user id (for ADMIN/PROJECT_MANAGER)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({
    example: 'E-commerce Platform Redesign',
    description: 'Project title',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'Complete overhaul of the company e-commerce website with new UI/UX',
    description: 'Detailed project description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    example: '2026-07-13',
    description: 'Project start date',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsCustomDate()
  @IsFutureDate()
  start_date: string;

  @ApiProperty({
    example: '2026-07-14',
    description: 'Project end date',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsCustomDate()
  @IsFutureDate()
  end_date: string;
}

export class UpdateProjectDto {
  @ApiProperty({
    example: 28,
    description: 'ID of the project to update',
    required: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({
    example: 'E-commerce Platform Redesign - Phase 2',
    description: 'Updated project title',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'Updated scope after initial client feedback',
    description: 'Updated project description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: EProjectStatus.ACTIVE,
    description: 'Current project status',
    enum: EProjectStatus,
    required: false,
  })
  @IsEnum(EProjectStatus)
  @IsOptional()
  status: EProjectStatus;

  @ApiProperty({
    example: '2026-07-13',
    description: 'Updated project start date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsFutureDate()
  start_date: string;

  @ApiProperty({
    example: '2026-11-14',
    description: 'Updated project end date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsFutureDate()
  end_date: string;
}

export class GetProjectDto {
  @ApiProperty({ description: 'id', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id?: number;
}
