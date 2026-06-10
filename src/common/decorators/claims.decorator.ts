import { SetMetadata } from '@nestjs/common';
import { EActions } from 'src/common/claims/task-claims.enum';

export const CLAIMS_KEY = 'claims';

export const Claims = (...claims: EActions[]) =>
  SetMetadata(CLAIMS_KEY, claims);
