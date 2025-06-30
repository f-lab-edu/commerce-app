import { UserEmailVO } from '../../user/vo/email.vo';
import { UserPhoneVO } from '../../user/vo/phone.vo';
import {
  VERIFICATION_CHANNELS,
  VerificationChannel,
} from '../command/sendCode.command';
import { Verificationable } from '../strategy/veriSendStrategy.interface';
import { VeriCodeVO } from './code.vo';

export class VerificationHistoryCreateCommand {
  constructor(
    private readonly _code: VeriCodeVO,
    private readonly _target: UserEmailVO | UserPhoneVO,
  ) {}

  get code() {
    return this._code;
  }

  get contact() {
    return this._target;
  }

  get expiredAt() {
    return this._code.expiredAt;
  }

  static from(
    code: VeriCodeVO,
    channel: VerificationChannel,
    to: Verificationable,
  ) {
    if (channel === VERIFICATION_CHANNELS.email) {
      return new VerificationHistoryCreateCommand(code, to);
    } else {
      return new VerificationHistoryCreateCommand(code, to);
    }
  }
}
