import { Provider } from '@nestjs/common';
import { EmailVerificationServiceImpl } from './email/email.serviceImpl';

export interface VerificationService {
  sendCode: (to: string) => Promise<void>;
}

export const VerificationServiceToken = Symbol('VerificationService');
export const VerificationServiceProvider: Provider<VerificationService> = {
  provide: VerificationServiceToken,
  useClass: EmailVerificationServiceImpl,
};
