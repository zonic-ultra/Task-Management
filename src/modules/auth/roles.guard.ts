// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { User } from './user.entity';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const skipGuard = this.reflector.get<boolean>(
//       'skipAuthGuard',
//       context.getHandler(),
//     );
//     if (skipGuard) {
//       return true;
//     }
//     const roles = this.reflector.get<string[]>('roles', context.getHandler());
//     if (!roles) {
//       return true;
//     }
//     const request = context.switchToHttp().getRequest<RequestWithUser>();
//     const user = request.user;

//     return roles.some((role) => user.EUse == role);
//   }
// }

// interface RequestWithUser extends Request {
//   user: User;
// }
