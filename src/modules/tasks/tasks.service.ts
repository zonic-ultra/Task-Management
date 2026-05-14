import { Body, Injectable } from '@nestjs/common';
import { Task, TasksStatus } from './tasks.model';
import { v6 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '../exceptions/NotFoundException';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((tasks) => {
        if (
          tasks.title.toLocaleLowerCase().includes(search) ||
          tasks.description.toLocaleLowerCase().includes(search)
        ) {
          return true;
        }

        return false;
      });
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TasksStatus.TODO,
    };

    this.tasks.push(task);

    return task;
  }

  findTaskByID(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(id);
    }

    return found;
  }

  deleteTaskById(id: string): void {
    const found = this.findTaskByID(id);

    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  updateTaskStatus(id: string, status: TasksStatus): Task {
    const task = this.findTaskByID(id);

    task.status = status;

    return task;
  }
}
