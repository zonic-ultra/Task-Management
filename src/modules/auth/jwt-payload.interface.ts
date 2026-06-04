import { EUserRole } from 'src/common/types.common';
import { EActions } from '../tasks/claims/task-claims.enum';

export interface JwtPayload {
  username: string;
  role: EUserRole;
  sub: number;
  claims: EActions[];
}
