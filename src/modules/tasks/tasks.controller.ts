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
import { Task } from './task.entity';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from './dto/tasks-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorators';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
import { Claims } from 'src/common/decorators/claims.decorator';
import { ClaimsGuard } from 'src/common/gaurds/claims.guard';
import { EActions } from '../../common/task-claims.enum';

// @UseGuards(AuthGuard())
@Controller('tasks')
@UseGuards(AuthGuard(), ClaimsGuard)
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private tasksService: TasksService) {}

  @Get()
  @Claims(EActions.READ)
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
    this.logger.verbose(`User "${user.username}" retrieving specific tasks`);
    return this.tasksService.getTaskByID(id);
  }

  @Post('/create')
  @Claims(EActions.CREATE)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    // this.logger.verbose(
    //   `User: "${user.username}" Created a task: ${createTaskDto.title}`,
    // );
    return this.tasksService.createTask(createTaskDto, user);
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
