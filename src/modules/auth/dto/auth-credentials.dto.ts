import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain at least 1 uppercase letter and 1 number',
  })
  password: string;

  @IsOptional()
  role: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
