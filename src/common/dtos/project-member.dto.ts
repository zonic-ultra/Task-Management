import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EProjectMemberRole } from '../enums/enum';

export class AddProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsEnum(EProjectMemberRole)
  @IsOptional()
  role?: EProjectMemberRole;
}

export class UpdateProjectMemberDto {
  @IsEnum(EProjectMemberRole)
  role: EProjectMemberRole;
}
