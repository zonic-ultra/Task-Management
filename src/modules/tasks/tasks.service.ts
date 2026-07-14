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
import {
  EMemberNotification,
  NotificationHelper,
} from 'src/common/notifications/notification.helper';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks, 'main_repo')
    private tasksRepository: Repository<Tasks>,
    private readonly notificationHelper: NotificationHelper,
  ) {}

  async getMyTasksOnProject(assignee_id: User): Promise<Tasks[]> {
    const query = this.tasksRepository.createQueryBuilder('tasks');
    query.where({ assignee_id });
    return query.getMany();
  }

  getTasksByProject(projectId: number): Promise<Tasks[]> {
    return this.tasksRepository.find({
      where: { project_id: projectId },
      relations: ['assignee', 'creator', 'subtasks', 'comments'],
    });
  }

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

  async createTask(
    createTaskDto: CreateTaskDto,
    projectId: number,
    user: User,
  ): Promise<Tasks> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      project_id: projectId,
      created_by: user.id,
    });

    const saved = await this.tasksRepository.save(task);

    if (saved.assignee_id) {
      void this.notificationHelper.notifyMember(
        saved.assignee_id,
        EMemberNotification.TASK_ASSIGNED,
        `You have been assigned to task "${saved.title}"`,
        { task_id: saved.id, project_id: saved.project_id },
      );
    }

    return saved;
  }

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
    const saved = await this.tasksRepository.save(task);

    if (task.assignee_id) {
      void this.notificationHelper.notifyMember(
        task.assignee_id,
        EMemberNotification.TASK_STATUS_UPDATED,
        `Task "${task.title}" status changed to "${update.status}"`,
        { task_id: task.id, project_id: task.project_id, status: update.status },
      );
    }

    return saved;
  }

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

    if (task.assignee_id) {
      void this.notificationHelper.notifyMember(
        task.assignee_id,
        EMemberNotification.TASK_DELETED,
        `Task "${task.title}" has been deleted`,
        { task_id: task.id, project_id: task.project_id },
      );
    }
  }
}
