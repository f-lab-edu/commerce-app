import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException, ExceptionParams } from './service.exception';

export abstract class OrderException extends CustomException {}

@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class ClientOrderInfoException extends OrderException {
  constructor(param?: ExceptionParams) {
    super({
      clientMsg: '잘못된 주문정보입니다. 다시 한번 시도해 주세요.',
      ...param,
    });
  }
}

@HttpStatusCode(HttpStatus.UNPROCESSABLE_ENTITY)
export class ProductStockException extends OrderException {}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class ProductUpdateException extends OrderException {}
