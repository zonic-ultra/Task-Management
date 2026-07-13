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
  Query,
  Req,
  Res,
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
  GetProjectDto,
  UpdateProjectDto,
} from 'src/common/dtos/project.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/entities/user.entity';
import { GetUser } from '../auth/get-user.decorators';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Claims } from 'src/common/decorators/claims.decorator';
import { EActions } from 'src/common/claims/task-claims.enum';
import type { Response } from 'express';
import type { ICustomRequest } from 'src/utils/common.interface';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly proSer: ProjectsService) {}

  @Get()
  @Roles(EUserRole.PROJECT_MANAGER)
  @ApiQuery({
    name: 'id',
    required: false,
    type: Number,
    description: 'Project id',
  })
  async getAll(
    @Query() dto: GetProjectDto,
    @Req() req: ICustomRequest,
    @Res() res: Response,
  ) {
    await this.proSer.getProjects(dto, req, res);
  }

  // @Get('/single')
  // @Roles(EUserRole.PROJECT_MANAGER)
  // async getOne(
  //   @Query() dto: GetProjectDto,
  //   @Req() req: ICustomRequest,
  //   @Res() res: Response,
  // ) {
  //   await this.proSer.getProject(dto, req, res);
  // }
  @Roles(EUserRole.PROJECT_MANAGER)
  @Claims(EActions.CREATE)
  @Post('/create')
  async createProject(
    @Body() dto: CreateProjectDto,
    @Req() req: ICustomRequest,
    @Res() res: Response,
  ) {
    await this.proSer.createProject(dto, req, res);
  }

  @Roles(EUserRole.PROJECT_MANAGER)
  @Claims(EActions.UPDATE)
  @Put('/update')
  async updateProject(
    @Body() dto: UpdateProjectDto,
    @Req() req: ICustomRequest,
    @Res() res: Response,
  ) {
    await this.proSer.updateProject(dto, req, res);
  }

  // @Put(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateDto: UpdateProjectDto,
  //   @GetUser() owner_id: User,
  // ) {
  //   return this.proSer.update(id, updateDto, owner_id.id);
  // }

  // @Delete(':id')
  // @Claims(EActions.DELETE)
  // @Roles(EUserRole.PROJECT_MANAGER)
  // delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.proSer.deletePro(id);
  // }
}
