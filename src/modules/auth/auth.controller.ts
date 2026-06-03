import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { ClaimsGuard } from 'src/common/gaurds/claims.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { EUserRole } from 'src/common/types.common';
import { GetUser } from './get-user.decorators';
import { RolesGuard } from 'src/common/gaurds/roles.guard';

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

  // @Get('/users')
  // @UseGuards(RolesGuard)
  // @Roles(EUserRole.ADMIN)
  // getAllUsers(): Promise<User[]> {
  //   return this.authService.getAllUsers();
  // }

  @Get('/users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(EUserRole.ADMIN)
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }
}
