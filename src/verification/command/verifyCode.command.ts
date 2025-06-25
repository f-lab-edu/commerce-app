import { UserEmailVO } from '../../user/vo/email.vo';
import { VeriCodeVO } from '../vo/code.vo';

export class VerifyCodeCommand {
  constructor(
    public readonly to: string,
    public readonly code: string,
  ) {}
}
