import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ServiceException } from '../exception/service.exception';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { HttpStatusCode } from '../decorator/httpCode.decorator';

@Injectable()
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  constructor(private reflector: Reflector) {}
  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      this.reflector.get(HttpStatusCode, exception.constructor) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message;

    return response.status(statusCode).json({ message });
  }
}
