import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { EUserRole } from '../types.common';
import { JwtPayload } from 'src/modules/auth/jwt-payload.interface';
interface AuthRoleRequest extends Request {
  user: JwtPayload;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRoleRequest>();

    const user = request.user;

    console.log('User:', user.role);
    console.log('Required Roles:', requiredRoles);

    return requiredRoles.includes(user.role);
  }
}
