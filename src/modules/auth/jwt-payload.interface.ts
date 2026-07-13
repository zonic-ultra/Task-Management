import { EUserRole } from 'src/common/enums/enum';
import { EActions } from '../../common/claims/task-claims.enum';

export interface JwtPayload {
  name: string;
  username: string;
  role: EUserRole;
  id: number;
  claims: EActions[];
}
