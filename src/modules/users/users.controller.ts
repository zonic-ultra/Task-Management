import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Claims } from 'src/common/decorators/claims.decorator';
import { EUserRole } from 'src/common/enums/enum';
import { EActions } from 'src/common/claims/task-claims.enum';
import { GetUsersDto } from 'src/common/dtos/auth-credentials.dto';
import type { Response } from 'express';
import type { ICustomRequest } from 'src/utils/common.interface';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(EUserRole.ADMIN)
  @Claims(EActions.READ)
  async getUsers(
    @Body() dto: GetUsersDto,
    @Req() req: ICustomRequest,
    @Res() res: Response,
  ) {
    await this.userService.users(dto, req, res);
  }

  // @Roles(EUserRole.ADMIN)
  // @Claims(EActions.DELETE)
  // @Delete(':id')
  // delUser(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.deleteUser(id);
  // }
}
