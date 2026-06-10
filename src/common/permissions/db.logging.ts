import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class HealthLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HealthCheck');

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap((result) => {
        this.logger.log(
          `Status: ${result.status} | DB: ${result.info?.database?.status ?? 'db'}`,
        );
      }),
    );
  }
}
