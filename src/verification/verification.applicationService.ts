import { Provider } from '@nestjs/common';
import { VeriApplicationServiceImpl } from './verification.applicationServiceImpl';
import { SendCodeCommand } from './command/sendCode.command';

export interface VerificationApplicationService {
  sendCode: (sendCodeCommand: SendCodeCommand) => Promise<void>;
}

export const VerificationServiceToken = Symbol(
  'VerificationApplicationService',
);
export const VerificationApplicationServiceProvider: Provider<VerificationApplicationService> =
  {
    provide: VerificationServiceToken,
    useClass: VeriApplicationServiceImpl,
  };
