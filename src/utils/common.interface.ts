import { EActions } from '../common/claims/task-claims.enum.js';
import { EUserRole } from '../common/enums/enum.js';
import { Request } from 'express';

export interface IClaims {
  id: number; // [FIXED] was id, must match JwtPayload
  name: string;
  username: string;
  role: EUserRole;
  claims: EActions[];
  iat?: number;
  exp?: number;
}

export interface ICustomRequest extends Request {
  claims?: IClaims;
  user?: {
    id?: number;
    role?: EUserRole;
  };
}

export interface INotification {
  notification_type: string;
  message: string;
  read: number;
  created_at?: string;
  [key: string]: unknown;
}
export interface IResponse {
  code: number;
  data: Record<any, any> | null;
}

// export interface INotification {
//   notification_type: ENotificationType;
//   internal_data: string;
//   created_at: string;
//   created_by: number | string;
//   creator_role: EAppRole;
// }

export interface INotificationAdjustment {
  org_id: number;
  member_id: number;
  [key: string]: unknown;
}

export interface INotificationLeave {
  org_id: number;
  member_id: number;
  [key: string]: unknown;
}

export interface INotificationPayroll {
  org_id: number;
  member_id: number;
  [key: string]: unknown;
}

export interface IRoundSetting {
  type: string;
  round: number;
  mins: number;
}
