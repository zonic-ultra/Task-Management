/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from 'src/common/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Claims } from 'src/common/decorators/claims.decorator';
import { EUserRole } from 'src/common/enums/enum';
import { EActions } from 'src/common/claims/task-claims.enum';
import { Public } from 'src/common/decorators/public.decorator';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Public()
  //   @Roles(EUserRole.ADMIN)
  //   @Claims(EActions.READ)
  getUsers(): Promise<User[]> {
    const list = this.userService.users();

    return list;
  }

  @Roles(EUserRole.ADMIN)
  @Claims(EActions.DELETE)
  @Delete(':id')
  delUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
