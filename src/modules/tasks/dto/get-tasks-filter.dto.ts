import { TasksStatus } from '../tasks.model';

export class GetTasksFilterDto {
  status?: TasksStatus;
  search?: string;
}
