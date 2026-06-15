/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { EUserRole } from 'src/common/enums/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AddMemberDto } from 'src/common/dtos/project-member.dto';
import { GetUser } from '../auth/get-user.decorators';
import { User } from 'src/common/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { ProjectMember } from 'src/common/entities/project.meber.entity';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';

@Controller('members')
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  // POST /projects/1/members — only PM can add
  @Post('/new-member')
  @Roles(EUserRole.PROJECT_MANAGER)
  addMember(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() dto: AddMemberDto,
    @GetUser() user: User,
  ) {
    return this.memberService.addMember(project_id, dto, user);
  }

  @Get()
  @Public()
  members(@GetUser() user_id: User): Promise<ProjectMember[]> {
    return this.memberService.members(user_id);
  }
}
