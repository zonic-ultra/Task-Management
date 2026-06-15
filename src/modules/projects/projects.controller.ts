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
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from 'src/common/entities/project.entity';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.guard';
import { RolesGuard } from 'src/common/gaurds/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRole } from 'src/common/enums/enum';
import {
  CreateProjectDto,
  UpdateProjectDto,
} from 'src/common/dtos/project.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/entities/user.entity';
import { GetUser } from '../auth/get-user.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Claims } from 'src/common/decorators/claims.decorator';
import { EActions } from 'src/common/claims/task-claims.enum';
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly proSer: ProjectsService) {}

  @Get()
  @Roles(EUserRole.PROJECT_MANAGER, EUserRole.ADMIN)
  getAll(@GetUser() owner_id: User): Promise<Project[]> {
    return this.proSer.getProjects(owner_id);
  }

  @Roles(EUserRole.ADMIN, EUserRole.PROJECT_MANAGER)
  @Post('/create')
  createProject(
    @GetUser() owner_id: number,
    @Body() create: CreateProjectDto,
  ): Promise<Project> {
    return this.proSer.createProject(owner_id, create);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectDto,
    @GetUser() owner_id: User,
  ): Promise<Project> {
    return this.proSer.update(id, updateDto, owner_id.id);
  }

  @Delete(':id')
  @Claims(EActions.DELETE)
  @Roles(EUserRole.PROJECT_MANAGER)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.proSer.deletePro(id);
  }
}
