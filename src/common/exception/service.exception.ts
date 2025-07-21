import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';

export abstract class CustomException extends Error {
  protected debuggingMessage: string | undefined;
  constructor(
    message: string, // 클라이언트로 보낼 메세지입니다.
    debuggingMessage?: string, // 디버깅용 메세지입니다.
    option?: ErrorOptions,
  ) {
    super(message, option);
    this.debuggingMessage = debuggingMessage ?? message;
  }

  getDebuggingMessage() {
    return this.debuggingMessage;
  }
}

export class VerificationException extends CustomException {}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class VerificationCodeSendException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}

@HttpStatusCode(HttpStatus.CONFLICT)
export class VerificationCodeAlreadySentException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}
@HttpStatusCode(HttpStatus.NOT_FOUND)
export class VerificationCodeNotFoundException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}
@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class VerificationExpiredException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}
@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class VerificationCodeMismatchException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}
@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class VerificationCodeAlreadyVerifiedException extends VerificationException {
  constructor(message: string) {
    super(message);
  }
}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class EmailSendException extends VerificationException {}
