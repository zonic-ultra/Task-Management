import { Body, Injectable } from '@nestjs/common';
import { v6 as uuid } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../common/entities/task.entity';
import { Repository } from 'typeorm';
import { logService } from 'src/common/util.common';
import { ETasksStatus } from 'src/common/enums/enum';

import { NotFoundException } from 'src/exceptions/exception';
import { User } from 'src/common/entities/user.entity';
import {
  CreateTaskDto,
  GetTasksFilterDto,
  UpdateTaskStatusDto,
} from 'src/common/dtos/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task, 'main_repo')
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    logService(`Succerssfully retrieved all tasks.`);
    return await this.tasksRepository.find();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: ETasksStatus.TODO,
    });

    await this.tasksRepository.save(task);
    logService(`Task with ID ${task.id} has been created.`);
    return task;
  }

  async getTaskByID(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(id);
    }

    return found;
  }

  async updateTaskStatus(
    id: string,
    update: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.getTaskByID(id);
    if (!task) {
      throw new NotFoundException(id);
    }

    task.status = update.status;

    await this.tasksRepository.save(task);

    logService(`Task with ID ${id} has been updated to status ${task.status}.`);

    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const task = await this.getTaskByID(id);
    if (!task) {
      throw new NotFoundException(id);
    }
    await this.tasksRepository.delete(id);
    logService(`Task with ID ${id} has been deleted.`);
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
