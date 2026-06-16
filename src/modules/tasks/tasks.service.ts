import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../../common/entities/task.entity';
import { User } from 'src/common/entities/user.entity';
import { EUserRole } from 'src/common/enums/enum';
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

  async getMyTasksOnProject(assignee_id: User): Promise<Tasks[]> {
    const query = this.tasksRepository.createQueryBuilder('tasks');

    query.where({ assignee_id });

    const tasks = await query.getMany();

    return tasks;
  }
  //errorrrrrrrrrrrrrrrrrrrrrrrrrrrr
  // ─── GET TASKS BY PROJECT ────────────────────────────
  getTasksByProject(projectId: number): Promise<Tasks[]> {
    return this.tasksRepository.find({
      where: { project_id: projectId },
      relations: ['assignee', 'creator', 'subtasks', 'comments'],
    });
  }

  // ─── GET SINGLE TASK ─────────────────────────────────
  async getTaskByID(id: number): Promise<Tasks> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignee', 'creator'],
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  // ─── CREATE TASK ─────────────────────────────────────
  async createTask(
    createTaskDto: CreateTaskDto,
    projectId: number,
    user: User,
  ): Promise<Tasks> {
    const task = this.tasksRepository.create({
      // title: createTaskDto.title,
      // description: createTaskDto.description,
      // priority: createTaskDto.priority,
      // assignee_id: createTaskDto.assignee_id,
      // due_date: createTaskDto.due_date,
      ...createTaskDto,
      project_id: projectId, // ← from URL param
      created_by: user.id, // ← from JWT
    });

    return this.tasksRepository.save(task);
  }

  // ─── UPDATE STATUS ───────────────────────────────────
  async updateTaskStatus(
    id: number,
    update: UpdateTaskStatusDto,
    user: User,
  ): Promise<Tasks> {
    const task = await this.getTaskByID(id);

    const isPM = user.role === EUserRole.PROJECT_MANAGER;
    const isAssignee = task.assignee_id === user.id;

    if (!isPM && !isAssignee) {
      throw new ForbiddenException(
        'You are not allowed to update this task status',
      );
    }

    task.status = update.status;
    return this.tasksRepository.save(task);
  }

  // ─── DELETE TASK ─────────────────────────────────────
  async deleteTaskById(id: number, user: User): Promise<void> {
    const task = await this.getTaskByID(id);

    const isAdminOrPM =
      user.role === EUserRole.ADMIN || user.role === EUserRole.PROJECT_MANAGER;

    if (!isAdminOrPM) {
      throw new ForbiddenException(
        'Only Admin or Project Manager can delete tasks',
      );
    }

    await this.tasksRepository.delete(task.id);
  }
}
