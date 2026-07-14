export enum EAppRole {
  ORG_ADMIN = 'org_admin',
  ORG_MEMBER = 'org_member',
}

export enum ENotificationType {
  TIME_ADJUSTMENT = 'time_adjustment',
  LEAVE_REQUEST = 'leave_request',
  PAYROLL = 'payroll',
}

export enum ESocketEvent {
  NewNotification = 'new_notification',
  ConnectionStatus = 'connection_status',
}

export enum EAdjustments {
  LATE = 'late',
  EARLY_IN = 'early_in',
  OVER_TIME = 'over_time',
  UNDER_TIME = 'under_time',
}

export enum EMemberRole {
  USER = 'user',
  PROJECT_MANAGER = 'project_manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
}
