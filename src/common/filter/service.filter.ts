import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from '../exception/service.exception';

@Injectable()
@Catch(CustomException)
export class ServiceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServiceExceptionFilter.name);
  constructor(private reflector: Reflector) {}
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      this.reflector.get(HttpStatusCode, exception.constructor) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message;
    this.logger.error(exception.getDebuggingMessage());

    return response.status(statusCode).json({ message });
  }
}
