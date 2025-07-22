import { HttpStatus, SetMetadata } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from './service.exception';
import { ResponseHeader } from '../decorator/header.decorator';

export class DomainException extends CustomException {}

@HttpStatusCode(HttpStatus.NOT_FOUND)
export class NotFoundException extends DomainException {}

@HttpStatusCode(HttpStatus.UNAUTHORIZED)
@ResponseHeader({
  Date: () => new Date().toUTCString(),
  ['WWW-Authenticate']: 'Bearer',
})
export class WrongPassword extends DomainException {}
