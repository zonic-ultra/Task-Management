import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Tasks } from '../../common/entities/task.entity';

import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorators';

import { Logger } from '@nestjs/common';
import { Claims } from 'src/common/decorators/claims.decorator';

import { RolesGuard } from 'src/common/gaurds/roles.guard';
import { EActions } from '../../common/claims/task-claims.enum';
import { ClaimsGuard } from 'src/common/gaurds/claims.guard';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { User } from 'src/common/entities/user.entity';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from 'src/common/dtos/task.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRole } from 'src/common/enums/enum';
@ApiBearerAuth()
@Controller('projects/:pro_id/tasks')
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private readonly tasksService: TasksService) {}

  // @Get()
  // // @Claims(EActions.READ)
  // // @SkipThrottle({ default: true })
  // @Public()
  // getAllTasks(
  //   @Query() filterDto: GetTasksFilterDto,
  //   @GetUser() user: User,
  // ): Promise<Tasks[]> {
  //   // this.logger.verbose(
  //   //   `User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`,
  //   // );
  //   return this.tasksService.getTasksWithFilters(filterDto, user);
  // }

  @Get('_')
  getAll(): Promise<Tasks[]> {
    return this.tasksService.getAllTasks();
  }
  @Get('my-tasks')
  getMyTasks(@GetUser() user: number): Promise<Tasks[]> {
    return this.tasksService.getMyTask(user);
  }

  @Get()
  @Roles(
    // EUserRole.ADMIN,
    EUserRole.PROJECT_MANAGER,
    EUserRole.MEMBER,
    // EUserRole.VIEWER,
  )
  getAllByPro(@Param('pro_id', ParseIntPipe) pro_id: number) {
    return this.tasksService.getTasksByProject(pro_id);
  }
  @Get('/:id')
  @Claims(EActions.READ)
  getTaskByID(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Tasks> {
    this.logger.verbose(`User "${user.name}" retrieving specific tasks`);
    return this.tasksService.getTaskByID(id);
  }

  @Post()
  @Claims(EActions.CREATE)
  @Roles(EUserRole.PROJECT_MANAGER)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('pro_id', ParseIntPipe) pro_id: number,
    @GetUser() cre_by: User,
  ): Promise<Tasks> {
    // this.logger.verbose(
    //   `User: "${cre_by}" Created a task: ${createTaskDto.title}`,
    // );
    // console.log(cre_by);
    return this.tasksService.createTask(createTaskDto, pro_id, cre_by);
  }

  @Patch('/:id/status')
  @Claims(EActions.UPDATE)
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() update: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Tasks> {
    this.logger.verbose(
      `User "${user.username}" updating status to ${update.status}`,
    );
    return this.tasksService.updateTaskStatus(id, update);
  }

  @Delete('/:id')
  @Claims(EActions.DELETE)
  deleteTaskByID(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`User: "${user.username}" Deleting the task id: ${id}`);
    return this.tasksService.deleteTaskById(id);
  }
}
