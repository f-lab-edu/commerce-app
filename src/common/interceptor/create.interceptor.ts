import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CreateHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();

    return next.handle().pipe(
      tap((data) => {
        if (data && data.id) {
          const location = `${req.protocol}://${req.host}/api/user/${data.id}`;
          res.setHeader('Location', location);
        }
      }),
    );
  }
}
