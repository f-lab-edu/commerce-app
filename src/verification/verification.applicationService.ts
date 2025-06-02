import { Provider } from '@nestjs/common';
import { VeriApplicationServiceImpl } from './verification.applicationServiceImpl';

export interface VerificationApplicationService {
  sendCode: (to: string) => Promise<void>;
}

export const VerificationServiceToken = Symbol(
  'VerificationApplicationService',
);
export const VerificationApplicationServiceProvider: Provider<VerificationApplicationService> =
  {
    provide: VerificationServiceToken,
    useClass: VeriApplicationServiceImpl,
  };
