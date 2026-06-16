export enum ETasksStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export enum EUserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum ETaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum EProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  COMPLETED = 'completed',
}

export enum EMemberRole {
  PROJECT_MANAGER = 'project_manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
}
