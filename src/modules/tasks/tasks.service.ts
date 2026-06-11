import { Body, Injectable } from '@nestjs/common';
import { v6 as uuid } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from '../../common/entities/task.entity';
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
    @InjectRepository(Tasks, 'main_repo')
    private tasksRepository: Repository<Tasks>,
  ) {}

  getTasksByProject(projectId: number): Promise<Tasks[]> {
    return this.tasksRepository.find({
      where: { project_id: projectId },
      relations: ['assignee', 'creator'],
    });
  }

  async getAllTasks(): Promise<Tasks[]> {
    logService(`Succerssfully retrieved all tasks.`);
    return await this.tasksRepository.find();
  }

  getMyTask(user: number): Promise<Tasks[]> {
    return this.tasksRepository.find({
      where: { assignee_id: user },
    });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    pro_id: number,
    cre_by: User,
  ): Promise<Tasks> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      project_id: pro_id,
      created_by: cre_by.id,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskByID(id: number): Promise<Tasks> {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(id);
    }

    return found;
  }

  async updateTaskStatus(
    id: number,
    update: UpdateTaskStatusDto,
  ): Promise<Tasks> {
    const task = await this.getTaskByID(id);
    if (!task) {
      throw new NotFoundException(id);
    }

    task.status = update.status;

    await this.tasksRepository.save(task);

    logService(`Task with ID ${id} has been updated to status ${task.status}.`);

    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
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
  ): Promise<Tasks[]> {
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
