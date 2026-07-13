import { ErrorCode } from 'src/common/enums/enum';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // ==============================
  // SERVER (500000)
  // ==============================
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    'An unexpected error occurred. Please try again later.',

  // ==============================
  // AUTHENTICATION (401000)
  // ==============================
  [ErrorCode.MISSING_AUTH_TOKEN]: 'Authentication token is missing.',
  [ErrorCode.INVALID_AUTH_TOKEN]: 'Authentication token is invalid.',
  [ErrorCode.MISSING_AUTH_CLAIMS]: 'Authentication claims are missing.',
  [ErrorCode.EXPIRED_AUTH_TOKEN]:
    'Authentication token has expired. Please log in again.',
  [ErrorCode.DIFFERENT_SESSION]:
    'A different session was detected. Please log in again.',

  // ==============================
  // PERMISSION / ACCESS (403000)
  // ==============================
  [ErrorCode.FORBIDDEN_PERMISSION]:
    'You do not have permission to perform this action.',
  [ErrorCode.FORBIDDEN_ROLE]:
    'Your role does not allow access to this resource.',
  [ErrorCode.ACCOUNT_INACTIVE]:
    'Your account is inactive. Please contact your administrator.', // [MISSING]
  [ErrorCode.ORGANIZATION_INACTIVE]: 'The organization is inactive.', // [MISSING]
  [ErrorCode.DEPARTMENT_INACTIVE]: 'The department is inactive.', // [MISSING]
  [ErrorCode.BRANCH_INACTIVE]: 'The branch is inactive.', // [MISSING]
  // ==============================
  // DTO (400999)
  // ==============================
  [ErrorCode.DTO_VALIDATION_ERROR]: 'One or more fields are invalid.',

  // ==============================
  // USER (400000)
  // ==============================
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid username or password.',
  [ErrorCode.USERNAME_ALREADY_EXIST]: 'Username already exists.',
  [ErrorCode.USER_DOES_NOT_EXIST]: 'User does not exist.',
  [ErrorCode.USER_NOT_ORG_MEMBER]: 'User is not a member of this organization.',

  // ==============================
  // USER RECORD (400050)
  // ==============================
  [ErrorCode.USER_RECORD_DOES_NOT_EXIST]: 'User record does not exist.',
  [ErrorCode.USER_ALREADY_ASSIGNED]: 'User is already assigned.',
  [ErrorCode.USER_ALREADY_UNASSIGNED]: 'User is already unassigned.',

  // ==============================
  // PROJECT (400900)
  // ==============================
  [ErrorCode.PROJECT_NOT_FOUND]: 'Project not found.',
  [ErrorCode.PROJECT_ALREADY_EXIST]: 'Project already exists.',
  [ErrorCode.PROJECT_ALREADY_ARCHIVED]: 'Project is already archived.',
  [ErrorCode.PROJECT_ALREADY_COMPLETED]: 'Project is already completed.',
  [ErrorCode.PROJECT_INACTIVE]: 'Project is inactive.',
  [ErrorCode.PROJECT_MEMBER_ALREADY_ASSIGNED]:
    'Member is already assigned to this project.',
  [ErrorCode.PROJECT_MEMBER_NOT_ASSIGNED]:
    'Member is not assigned to this project.',
  [ErrorCode.PROJECT_OWNER_CANNOT_BE_REMOVED]:
    'Project owner cannot be removed from the project.',

  [ErrorCode.INVALID_DATE_FORMAT]: 'Invalid date format',

  // ==============================
  // TASK (400950)
  // ==============================
  [ErrorCode.TASK_NOT_FOUND]: 'Task not found.',
  [ErrorCode.TASK_ALREADY_EXIST]: 'Task already exists.',
  [ErrorCode.TASK_ALREADY_COMPLETED]: 'Task is already completed.',
  [ErrorCode.TASK_ALREADY_ARCHIVED]: 'Task is already archived.',
  [ErrorCode.TASK_INVALID_STATUS_TRANSITION]: 'Invalid task status transition.',
  [ErrorCode.TASK_ASSIGNEE_NOT_PROJECT_MEMBER]:
    'Assignee is not a member of this project.',
  [ErrorCode.TASK_DUE_DATE_BEFORE_START]:
    'Task due date cannot be before the start date.',
  [ErrorCode.TASK_DUE_DATE_ALREADY_PASSED]: 'Task due date has already passed.',

  // ==============================
  // TASK COMMENT (400960)
  // ==============================
  [ErrorCode.TASK_COMMENT_NOT_FOUND]: 'Task comment not found.',
  [ErrorCode.TASK_COMMENT_NOT_OWNER]: 'You are not the owner of this comment.',

  // ==============================
  // TASK ATTACHMENT (400970)
  // ==============================
  [ErrorCode.TASK_ATTACHMENT_NOT_FOUND]: 'Task attachment not found.',
  [ErrorCode.TASK_ATTACHMENT_INVALID_TYPE]: 'Invalid attachment file type.',
  [ErrorCode.TASK_ATTACHMENT_SIZE_EXCEEDED]:
    'Attachment file size exceeds the allowed limit.',

  // ==============================
  // SPRINT (400980)
  // ==============================
  [ErrorCode.SPRINT_NOT_FOUND]: 'Sprint not found.',
  [ErrorCode.SPRINT_ALREADY_EXIST]: 'Sprint already exists.',
  [ErrorCode.SPRINT_ALREADY_STARTED]: 'Sprint has already started.',
  [ErrorCode.SPRINT_ALREADY_COMPLETED]: 'Sprint is already completed.',
  [ErrorCode.SPRINT_DATE_CONFLICT]:
    'Sprint dates conflict with an existing sprint.',
  [ErrorCode.SPRINT_TASK_ALREADY_ASSIGNED]:
    'Task is already assigned to this sprint.',
  [ErrorCode.SPRINT_TASK_NOT_ASSIGNED]: 'Task is not assigned to this sprint.',
};
