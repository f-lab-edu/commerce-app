import { UserEmailVO } from '../../user/vo/email.vo';
import { VeriCodeVO } from './code.vo';

export class CreateVeriCommand {
  constructor(
    private readonly _code: VeriCodeVO,
    private readonly _target: UserEmailVO,
  ) {}

  get code() {
    return this._code;
  }

  get email() {
    return this._target;
  }

  get expiredAt() {
    return this._code.expiredAt;
  }
}
