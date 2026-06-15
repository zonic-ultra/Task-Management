import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EProjectStatus } from '../enums/enum';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({
    example: 'E-commerce Platform Redesign',
    description: 'Project title',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Complete overhaul of the company e-commerce website with new UI/UX',
    description: 'Detailed project description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '2026-07-01T00:00:00Z',
    description: 'Project start date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({
    example: '2026-12-15T00:00:00Z',
    description: 'Project end date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  end_date: Date;
}

export class UpdateProjectDto {
  @ApiProperty({
    example: 'E-commerce Platform Redesign - Phase 2',
    description: 'Updated project title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'Updated scope after initial client feedback',
    description: 'Updated project description',
    required: false,
  })
  @IsString()
  @IsOptional()
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
    example: '2026-07-10T00:00:00Z',
    description: 'Updated project start date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({
    example: '2026-11-30T00:00:00Z',
    description: 'Updated project end date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  end_date: Date;
}
