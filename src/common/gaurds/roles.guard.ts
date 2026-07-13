import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { EUserRole, ErrorCode } from '../enums/enum';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
import { ERROR_MESSAGES } from 'src/utils/error.message.constant';

interface AuthRoleRequest extends Request {
  user?: JwtPayload | { role?: EUserRole };
  claims?: { role?: EUserRole };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRoleRequest>();

    const user = request.user ?? request.claims;

    if (!user) {
      throw new ForbiddenException({
        code: ErrorCode.FORBIDDEN_ROLE,
        message: ERROR_MESSAGES[ErrorCode.FORBIDDEN_ROLE],
      });
    }

    const role = user.role;

    if (!role) {
      throw new ForbiddenException({
        code: ErrorCode.USER_DOES_NOT_EXIST,
        message: ERROR_MESSAGES[ErrorCode.USER_DOES_NOT_EXIST],
      });
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException({
        code: ErrorCode.FORBIDDEN_ROLE,
        message: ERROR_MESSAGES[ErrorCode.FORBIDDEN_ROLE],
      });
    }

    return true;
  }
}
