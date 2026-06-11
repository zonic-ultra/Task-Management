import { EActions } from 'src/common/claims/task-claims.enum';
import { EUserRole } from '../enums/enum';

export const ROLE_CLAIMS: Record<EUserRole, EActions[]> = {
  [EUserRole.ADMIN]: [EActions.CREATE, EActions.READ, EActions.DELETE],
  [EUserRole.PROJECT_MANAGER]: [
    EActions.CREATE,
    EActions.READ,
    EActions.UPDATE,
    EActions.DELETE,
  ],
  [EUserRole.MEMBER]: [EActions.CREATE, EActions.READ, EActions.UPDATE],
  [EUserRole.VIEWER]: [EActions.READ],
};
