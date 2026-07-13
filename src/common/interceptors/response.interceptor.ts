// // common/interceptors/response.interceptor.ts
// import { number } from '@hapi/joi';
// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class ResponseInterceptor<T> implements NestInterceptor<T> {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
//     return next.handle().pipe(
//       map((data) => ({
//         code: number,
//         data: T,
//       })),
//     );
//   }
// }
