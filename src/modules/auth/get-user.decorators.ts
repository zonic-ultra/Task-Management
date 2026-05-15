import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

interface RequestWithUser extends Request {
  user: User;
}

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user;
  },
);
