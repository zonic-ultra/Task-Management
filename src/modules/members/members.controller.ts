/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { EUserRole } from 'src/common/enums/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  AddMemberDto,
  UpdateMemberDto,
} from 'src/common/dtos/project-member.dto';
import { GetUser } from '../auth/get-user.decorators';
import { User } from 'src/common/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { ProjectMember } from 'src/common/entities/project.meber.entity';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Claims } from 'src/common/decorators/claims.decorator';
import { EActions } from 'src/common/claims/task-claims.enum';
import { MemberResponseDto } from 'src/common/response/member.response.dto';

@Controller('members')
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  // POST /projects/1/members — only PM can add
  @Post(':project_id/new-member')
  @Roles(EUserRole.PROJECT_MANAGER)
  @Claims(EActions.CREATE)
  addMember(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() dto: AddMemberDto,
    @GetUser() user: User,
  ) {
    return this.memberService.addMember(project_id, dto, user);
  }

  @Get(':project_id')
  @Roles(EUserRole.PROJECT_MANAGER)
  @Claims(EActions.READ)
  members(
    @Param('project_id', ParseIntPipe) project_id: number,
    @GetUser() user: User,
  ) {
    return this.memberService.members(project_id, user);
  }

  @Patch(':id')
  @Roles(EUserRole.PROJECT_MANAGER)
  updateMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() update: UpdateMemberDto,
    @GetUser() user: User,
  ) {
    return this.memberService.updateMember(id, update, user);
  }

  @Delete(':id')
  @Roles(EUserRole.PROJECT_MANAGER)
  removeMember(@Param('id') id: number, @GetUser() user: User) {
    return this.memberService.deleteMember(id, user);
  }
}
