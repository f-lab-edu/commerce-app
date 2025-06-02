import { Provider } from '@nestjs/common';
import { EmailServiceImpl } from '../email/email.serviceImpl';
import { VeriCodeVO } from '../vo/code.vo';
import { UserEmailVO } from '../../user/vo/email.vo';

export interface VeriService {
  sendCode(to: UserEmailVO): Promise<VeriCodeVO>;
}

export const VeriServiceToken = Symbol('VeriServiceToken');
export const VeriServicePovider: Provider<VeriService> = {
  provide: VeriServiceToken,
  useClass: EmailServiceImpl,
};
