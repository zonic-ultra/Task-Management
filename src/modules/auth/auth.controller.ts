import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() authCredentialsDto: RegisterUserDto): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }

  @Post('/login')
  login(
    @Body() authCredentialsDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialsDto);
  }

  @Get('/users')
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }
}
