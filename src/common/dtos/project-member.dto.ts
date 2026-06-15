import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { EMemberRole } from '../enums/enum';

export class AddMemberDto {
  // @IsNotEmpty()
  // user_id: string;

  @IsEmail()
  username: string;

  @IsEnum(EMemberRole)
  @IsOptional()
  role?: EMemberRole;
}

export class UpdateMemberDto {
  @IsEnum(EMemberRole)
  role: EMemberRole;
}
