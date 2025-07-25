import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';

type ExceptionParams = {
  clientMsg: string;
  devMsg?: string;
  option?: ErrorOptions;
};

export abstract class CustomException extends Error {
  protected devMsg: string | undefined;
  constructor(params: ExceptionParams) {
    super(params.clientMsg, params.option);
    this.devMsg = params.devMsg ?? params.clientMsg;
  }

  getDebuggingMessage() {
    return this.devMsg;
  }
}

export class VerificationException extends CustomException {}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class VerificationCodeSendException extends VerificationException {
  constructor(param: ExceptionParams) {
    super(param);
  }
}

@HttpStatusCode(HttpStatus.CONFLICT)
export class VerificationCodeAlreadySentException extends VerificationException {
  constructor(param: ExceptionParams) {
    super(param);
  }
}
@HttpStatusCode(HttpStatus.NOT_FOUND)
export class VerificationCodeNotFoundException extends VerificationException {
  constructor(param: ExceptionParams) {
    super(param);
  }
}
@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class VerificationExpiredException extends VerificationException {
  constructor(param: ExceptionParams) {
    super(param);
  }
}
@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class VerificationCodeMismatchException extends VerificationException {
  constructor(param: ExceptionParams) {
    super(param);
  }
}
@HttpStatusCode(HttpStatus.BAD_REQUEST)
export class VerificationCodeAlreadyVerifiedException extends VerificationException {
  constructor(param: ExceptionParams) {
    super(param);
  }
}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class EmailSendException extends VerificationException {}
