import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from './service.exception';

export abstract class OrderException extends CustomException {}

@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class ClientOrderInfoException extends OrderException {}
