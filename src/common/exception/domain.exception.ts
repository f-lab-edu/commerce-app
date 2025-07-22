import { HttpStatus, SetMetadata } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from './service.exception';

export class DomainException extends CustomException {}

@HttpStatusCode(HttpStatus.NOT_FOUND)
export class NotFoundException extends DomainException {}

@HttpStatusCode(HttpStatus.UNAUTHORIZED)
export class WrongPassword extends DomainException {}
