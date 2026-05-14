export interface Task {
  id: string;
  title: string;
  description: string;
  status: TasksStatus;
}

export enum TasksStatus {
  TODO = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'DONE',
}
