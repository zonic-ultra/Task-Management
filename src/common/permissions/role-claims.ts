import { EActions } from 'src/modules/tasks/claims/task-claims.enum';
import { EUserRole } from '../types.common';

export const ROLE_CLAIMS: Record<EUserRole, EActions[]> = {
  [EUserRole.ADMIN]: [
    EActions.CREATE,
    EActions.READ,
    EActions.UPDATE,
    EActions.DELETE,
  ],
  [EUserRole.MANAGER]: [EActions.CREATE, EActions.READ, EActions.UPDATE],
  [EUserRole.USER]: [EActions.READ, EActions.UPDATE],
};
