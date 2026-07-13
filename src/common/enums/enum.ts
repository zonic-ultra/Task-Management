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

export enum ErrorCode {
  // ==============================
  // SERVER (500000)
  // ==============================
  INTERNAL_SERVER_ERROR = 500001,

  // ==============================
  // AUTHENTICATION (401000)
  // ==============================
  MISSING_AUTH_TOKEN = 401001,
  INVALID_AUTH_TOKEN = 401002,
  MISSING_AUTH_CLAIMS = 401003,
  EXPIRED_AUTH_TOKEN = 401004,
  DIFFERENT_SESSION = 401005,

  INVALID_DATE_FORMAT = 400601,

  // ==============================
  // PERMISSION / ACCESS (403000)
  // ==============================
  FORBIDDEN_PERMISSION = 403001,
  FORBIDDEN_ROLE = 403002,
  ACCOUNT_INACTIVE = 403003,
  ORGANIZATION_INACTIVE = 403004,
  DEPARTMENT_INACTIVE = 403005,
  BRANCH_INACTIVE = 403006,

  // ==============================
  // DTO (400999)
  // ==============================
  DTO_VALIDATION_ERROR = 400999,

  // ==============================
  // USER (400000)
  // ==============================
  INVALID_CREDENTIALS = 400001,
  USERNAME_ALREADY_EXIST = 400002,
  USER_DOES_NOT_EXIST = 400003,
  USER_NOT_ORG_MEMBER = 400004,

  // ==============================
  // USER RECORD (400050)
  // ==============================
  USER_RECORD_DOES_NOT_EXIST = 400051,
  USER_ALREADY_ASSIGNED = 400052,
  USER_ALREADY_UNASSIGNED = 400053,

  // ==============================
  // PROJECT (400900)
  // ==============================
  PROJECT_NOT_FOUND = 400901,
  PROJECT_ALREADY_EXIST = 400902,
  PROJECT_ALREADY_ARCHIVED = 400903,
  PROJECT_ALREADY_COMPLETED = 400904,
  PROJECT_INACTIVE = 400905,
  PROJECT_MEMBER_ALREADY_ASSIGNED = 400906,
  PROJECT_MEMBER_NOT_ASSIGNED = 400907,
  PROJECT_OWNER_CANNOT_BE_REMOVED = 400908,

  // ==============================
  // TASK (400950)
  // ==============================
  TASK_NOT_FOUND = 400951,
  TASK_ALREADY_EXIST = 400952,
  TASK_ALREADY_COMPLETED = 400953,
  TASK_ALREADY_ARCHIVED = 400954,
  TASK_INVALID_STATUS_TRANSITION = 400955,
  TASK_ASSIGNEE_NOT_PROJECT_MEMBER = 400956,
  TASK_DUE_DATE_BEFORE_START = 400957,
  TASK_DUE_DATE_ALREADY_PASSED = 400958,

  // ==============================
  // TASK COMMENT (400960)
  // ==============================
  TASK_COMMENT_NOT_FOUND = 400961,
  TASK_COMMENT_NOT_OWNER = 400962,

  // ==============================
  // TASK ATTACHMENT (400970)
  // ==============================
  TASK_ATTACHMENT_NOT_FOUND = 400971,
  TASK_ATTACHMENT_INVALID_TYPE = 400972,
  TASK_ATTACHMENT_SIZE_EXCEEDED = 400973,

  // ==============================
  // SPRINT (400980)
  // ==============================
  SPRINT_NOT_FOUND = 400981,
  SPRINT_ALREADY_EXIST = 400982,
  SPRINT_ALREADY_STARTED = 400983,
  SPRINT_ALREADY_COMPLETED = 400984,
  SPRINT_DATE_CONFLICT = 400985,
  SPRINT_TASK_ALREADY_ASSIGNED = 400986,
  SPRINT_TASK_NOT_ASSIGNED = 400987,
}
