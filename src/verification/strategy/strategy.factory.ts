import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailSendStrategy } from './emailSendStrategy';
import { SmsSendStrategy } from './smsSendStrategy';
import {
  availableMethods,
  TVerificationMethod,
  VERIFICATION_CHANNELS,
} from '../command/sendCode.command';

@Injectable()
export class VeriStrategyFactory {
  constructor(
    private readonly emailStrategy: EmailSendStrategy,
    private readonly smsStrategy: SmsSendStrategy,
  ) {}

  getStrategy(channel: TVerificationMethod) {
    switch (channel) {
      case VERIFICATION_CHANNELS.email:
        return this.emailStrategy;
      case VERIFICATION_CHANNELS.sms:
        return this.smsStrategy;
      default:
        throw new InternalServerErrorException(
          `${channel}은(는) 지원하지 않는 인증수단입니다.  ${availableMethods} 중 하나를 선택하여 다시 인증해 주시길 바랍니다.`,
        );
    }
  }
}
