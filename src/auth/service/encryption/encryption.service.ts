import { Provider } from '@nestjs/common';
import { EncryptionServiceImpl } from './encryption.serviceImpl';
import { UserHashedPasswordVO } from '../../../user/vo/hashedPassword.vo';
import { UserRawPasswordVO } from '../../../user/vo/rawPassword.vo';

export interface EncryptionService {
  hash: (password: UserRawPasswordVO) => Promise<UserHashedPasswordVO>;
}

export const EncryptionServiceToken = Symbol('EncryptionService');
export const EncryptionServiceProvider: Provider<EncryptionService> = {
  provide: EncryptionServiceToken,
  useClass: EncryptionServiceImpl,
};
