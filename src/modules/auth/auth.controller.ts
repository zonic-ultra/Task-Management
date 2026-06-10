import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
} from '../../common/dtos/auth-credentials.dto';
import { User } from '../../common/entities/user.entity';
import { ClaimsGuard } from 'src/common/gaurds/claims.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { EUserRole } from 'src/common/enums/enum';
import { RolesGuard } from 'src/common/gaurds/roles.guard';
import { Claims } from 'src/common/decorators/claims.decorator';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  register(@Body() authCredentialsDto: RegisterUserDto): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }

  @Post('/login')
  @Public()
  login(
    @Body() authCredentialsDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialsDto);
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  // @Claims(EActions.READ)
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }
}
