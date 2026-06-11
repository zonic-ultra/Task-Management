import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EProjectStatus } from '../enums/enum';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @Type(() => Date)
  start_date: Date;
  @IsOptional()
  @Type(() => Date)
  end_date: Date;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(EProjectStatus)
  @IsOptional()
  status: EProjectStatus;

  @IsOptional()
  @Type(() => Date)
  start_date: Date;

  @IsOptional()
  @Type(() => Date)
  end_date: Date;
}
