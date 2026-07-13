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

export interface IResponse {
  code: number;
  data: Record<any, any> | null;
}
