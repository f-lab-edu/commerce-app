import { UserEmailVO } from '../../user/vo/email.vo';
import { UserPhoneVO } from '../../user/vo/phone.vo';

import { Verificationable } from '../strategy/veriSendStrategy.interface';
import { VeriCodeVO } from './code.vo';

export class VerificationHistoryCreateCommand {
  constructor(
    private readonly _code: VeriCodeVO,
    private readonly _target: Verificationable,
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
}
