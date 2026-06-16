import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Tasks } from '../../common/entities/task.entity';
import { GetUser } from '../auth/get-user.decorators';
import { Claims } from 'src/common/decorators/claims.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/gaurds/roles.guard';
import { ClaimsGuard } from 'src/common/gaurds/claims.guard';
import { EActions } from '../../common/claims/task-claims.enum';
import { EUserRole } from 'src/common/enums/enum';
import { User } from 'src/common/entities/user.entity';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from 'src/common/dtos/task.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiBearerAuth()
@UseGuards(RolesGuard, ClaimsGuard)
@Controller('projects/:projectId/tasks')
export class TasksController {
  private logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  // GET /projects/1/tasks?status=todo&search=login

  // @Get()
  // @Roles(EUserRole.PROJECT_MANAGER, EUserRole.MEMBER)
  // @Claims(EActions.READ)
  // // @Public()
  // getAllTasks(
  //   @Param('projectId', ParseIntPipe) projectId: number,
  //   @Query() filterDto: GetTasksFilterDto,
  //   @GetUser() user: User,
  // ): Promise<Tasks[]> {
  //   this.logger.verbose(
  //     `User "${user.username}" retrieving tasks for project ${projectId}`,
  //   );
  //   return this.tasksService.getTasksWithFilters(projectId, filterDto, user);
  // }
  @Get()
  @Roles(EUserRole.PROJECT_MANAGER, EUserRole.MEMBER)
  getMyTasks(@GetUser() assignee_id: User): Promise<Tasks[]> {
    return this.tasksService.getMyTasksOnProject(assignee_id);
  }

  // GET /projects/1/tasks/5
  @Get(':id')
  @Roles(EUserRole.PROJECT_MANAGER, EUserRole.MEMBER)
  @Claims(EActions.READ)
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Tasks> {
    this.logger.verbose(`User "${user.username}" retrieving task ${id}`);
    return this.tasksService.getTaskByID(id);
  }

  // POST /projects/1/tasks
  @Post()
  @Roles(EUserRole.PROJECT_MANAGER, EUserRole.MEMBER)
  @Claims(EActions.CREATE)
  createTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Tasks> {
    this.logger.verbose(
      `User "${user.username}" creating task "${createTaskDto.title}"`,
    );
    return this.tasksService.createTask(createTaskDto, projectId, user);
  }

  // PATCH /projects/1/tasks/5/status
  @Patch(':id/status')
  @Roles(EUserRole.PROJECT_MANAGER, EUserRole.MEMBER)
  @Claims(EActions.UPDATE)
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() update: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTaskStatus(id, update, user);
  }

  // DELETE /projects/1/tasks/5
  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.PROJECT_MANAGER)
  @Claims(EActions.DELETE)
  deleteTaskByID(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.tasksService.deleteTaskById(id, user);
  }
}
