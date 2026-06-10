import { EUserRole } from 'src/common/enums/enum';
import { EActions } from '../../common/claims/task-claims.enum';

export interface JwtPayload {
  username: string;
  role: EUserRole;
  sub: number;
  claims: EActions[];
}
