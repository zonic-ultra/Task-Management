import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { EUserRole } from '../enums/enum';
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

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRoleRequest>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated from roles');
    }

    console.log('Role:', user.role);
    console.log('Name:', user.username);
    console.log('Required Roles:', requiredRoles);

    return requiredRoles.includes(user.role);
  }
}
