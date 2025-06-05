import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CreateHeaderInterceptor } from '../interceptor/create.interceptor';

export const SuccessWithLocation = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    UseInterceptors(CreateHeaderInterceptor),
  );
};
