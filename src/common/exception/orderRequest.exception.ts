import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from './service.exception';

export abstract class OrderRequest extends CustomException {}

@HttpStatusCode(HttpStatus.CONFLICT)
export class ConflictRequestException extends OrderRequest {}

@HttpStatusCode(HttpStatus.UNPROCESSABLE_ENTITY)
export class UnprocessableException extends OrderRequest {}
