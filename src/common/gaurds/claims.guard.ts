import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { CLAIMS_KEY } from '../decorators/claims.decorator';
import { EActions } from 'src/common/task-claims.enum';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
interface AuthClaimsRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class ClaimsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredClaims = this.reflector.getAllAndOverride<EActions[]>(
      CLAIMS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredClaims) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthClaimsRequest>();

    const user = request.user;

    console.log('Required Claims:', requiredClaims);
    console.log('User Claims:', user?.claims);

    const hasClaims = requiredClaims.every((claim) =>
      user?.claims?.includes(claim),
    );

    if (!hasClaims) {
      throw new ForbiddenException('Missing required claim');
    }

    return true;
  }
}
