import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from './dto/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getFilterAndSearchTasks(
    @Query() filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    return this.tasksService.getTasksWithFilters(filterDto);
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskByID(id);
  }

  @Post('/create')
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() update: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, update);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }
}
