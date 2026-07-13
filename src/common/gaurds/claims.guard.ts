import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { CLAIMS_KEY } from '../decorators/claims.decorator';
import { EActions } from 'src/common/claims/task-claims.enum';
import { ErrorCode } from 'src/common/enums/enum';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { Request } from 'express';
import { ERROR_MESSAGES } from 'src/utils/error.message.constant';

interface ClaimsRequest extends Request {
  user: JwtPayload & {
    claims: EActions[];
  };
}

@Injectable()
export class ClaimsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredClaims = this.reflector.getAllAndOverride<EActions[]>(
      CLAIMS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredClaims?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ClaimsRequest>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException({
        code: ErrorCode.MISSING_AUTH_CLAIMS,
        message: ERROR_MESSAGES[ErrorCode.MISSING_AUTH_CLAIMS],
      });
    }

    console.log('Required Claims:', requiredClaims);
    console.log('User Claims:', user.claims);

    const hasClaims = requiredClaims.every((claim) =>
      user.claims.includes(claim),
    );

    if (!hasClaims) {
      throw new ForbiddenException({
        code: ErrorCode.FORBIDDEN_PERMISSION,
        message: ERROR_MESSAGES[ErrorCode.FORBIDDEN_PERMISSION],
      });
    }

    return true;
  }
}
