import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Nest.js built-in 데코레이터에 동일한 Header 데코레이터가 있지만
 * Pipe와 연동이 불가하여, 새로 개발하게 됐습니다.
 */
export const CustomHeader = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers[key];

    return header;
  },
);
