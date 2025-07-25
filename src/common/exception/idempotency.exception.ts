import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from './service.exception';

export abstract class IdempotencyException extends CustomException {}

@HttpStatusCode(HttpStatus.CONFLICT)
export class ConflictRequestException extends IdempotencyException {}

@HttpStatusCode(HttpStatus.UNPROCESSABLE_ENTITY)
export class UnprocessableException extends IdempotencyException {}
