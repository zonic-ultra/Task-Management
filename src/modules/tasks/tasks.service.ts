import { Body, Injectable } from '@nestjs/common';
import { Task, TasksStatus } from './tasks.model';
import { v6 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
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
      throw new Error(`Task with ID ${id} not found`);
    }

    return found;
  }
}
