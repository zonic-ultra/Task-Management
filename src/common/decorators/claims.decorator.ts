import { SetMetadata } from '@nestjs/common';
import { EActions } from 'src/modules/tasks/claims/task-claims.enum';
import { EUserRole } from '../types.common';

export const CLAIMS_KEY = 'claims';

export const Claims = (...claims: EActions[]) =>
  SetMetadata(CLAIMS_KEY, claims);
