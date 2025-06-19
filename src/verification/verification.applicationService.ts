import { Provider } from '@nestjs/common';
import { VeriApplicationServiceImpl } from './verification.applicationServiceImpl';
import { SendCodeCommand } from './command/sendCode.command';
import { PersistedEmailVerificationEntity } from './entity/emailVerification.entity';
import { VerifyCodeCommand } from './command/verifyCode.command';

export interface VerificationApplicationService {
  sendCode: (
    sendCodeCommand: SendCodeCommand,
  ) => Promise<PersistedEmailVerificationEntity>;

  verifyCode: (verifyCodeCommand: VerifyCodeCommand) => Promise<boolean>;
}

export const VerificationServiceToken = Symbol(
  'VerificationApplicationService',
);
export const VerificationApplicationServiceProvider: Provider<VerificationApplicationService> =
  {
    provide: VerificationServiceToken,
    useClass: VeriApplicationServiceImpl,
  };
