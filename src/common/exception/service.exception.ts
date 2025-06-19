import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';

export class ServiceException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class VerificationException extends ServiceException {
  constructor(message: string) {
    super(message);
  }
}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class VerificationCodeSendException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}

@HttpStatusCode(HttpStatus.CONFLICT)
export class VerificationValidExists extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}
@HttpStatusCode(HttpStatus.NOT_FOUND)
export class VerificationValidNotExists extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class EmailSendException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}
