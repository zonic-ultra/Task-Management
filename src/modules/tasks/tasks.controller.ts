import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../../common/entities/task.entity';

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
@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard(), RolesGuard, ClaimsGuard)
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private tasksService: TasksService) {}

  @Get()
  @Claims(EActions.READ)
  // @SkipThrottle({ default: true })
  // @Public()
  getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    // this.logger.verbose(
    //   `User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`,
    // );
    return this.tasksService.getTasksWithFilters(filterDto, user);
  }

  @Get('/:id')
  @Claims(EActions.READ)
  getTaskByID(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.name}" retrieving specific tasks`);
    return this.tasksService.getTaskByID(id);
  }

  @Post('/create')
  @Claims(EActions.CREATE)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    // @GetUser() user: User,
  ): Promise<Task> {
    // this.logger.verbose(
    //   `User: "${user.username}" Created a task: ${createTaskDto.title}`,
    // );
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  @Claims(EActions.UPDATE)
  updateTaskStatus(
    @Param('id') id: string,
    @Body() update: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" updating status to ${update.status}`,
    );
    return this.tasksService.updateTaskStatus(id, update);
  }

  @Delete('/:id')
  @Claims(EActions.DELETE)
  deleteTaskByID(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`User: "${user.username}" Deleting the task id: ${id}`);
    return this.tasksService.deleteTaskById(id);
  }
}
