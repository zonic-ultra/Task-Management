import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { EUserRole } from 'src/common/enums/enum';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @MinLength(8)
  // @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
  //   message: 'Password must contain at least 1 uppercase letter and 1 number',
  // })
  password: string;

  @IsOptional()
  @IsEnum(EUserRole)
  role: EUserRole;
}

export class LoginUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @MinLength(8)
  new_password: string;
}
