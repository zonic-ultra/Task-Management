export interface Task {
  id: string;
  title: string;
  description: string;
  status: TasksStatus;
}

export enum TasksStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
}
