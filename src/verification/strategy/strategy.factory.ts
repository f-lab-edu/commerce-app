import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailSendStrategy } from './emailSendStrategy';
import { SmsSendStrategy } from './smsSendStrategy';
import {
  availableMethods,
  TVerificationMethod,
  VERIFICATION_METHODS,
} from '../command/sendCode.command';

@Injectable()
export class VeriStrategyFactory {
  constructor(
    private readonly emailStrategy: EmailSendStrategy,
    private readonly smsStrategy: SmsSendStrategy,
  ) {}

  getStrategy(method: TVerificationMethod) {
    switch (method) {
      case VERIFICATION_METHODS.email:
        return this.emailStrategy;
      case VERIFICATION_METHODS.sms:
        return this.smsStrategy;
      default:
        throw new InternalServerErrorException(
          `${method}는 지원하지 않는 인증수단입니다.  ${availableMethods} 중 하나를 선택하여 다시 인증해 주시길 바랍니다.`,
        );
    }
  }
}
