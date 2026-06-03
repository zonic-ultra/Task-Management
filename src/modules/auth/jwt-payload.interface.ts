import { EActions } from '../tasks/claims/task-claims.enum';

export interface JwtPayload {
  username: string;
  sub: number;
  claims: EActions[];
}
