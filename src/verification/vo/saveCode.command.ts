import { UserEmailVO } from '../../user/vo/email.vo';
import { UserPhoneVO } from '../../user/vo/phone.vo';

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

  static from(code: VeriCodeVO, to: Verificationable) {
    return new VerificationHistoryCreateCommand(code, to);
  }
}
