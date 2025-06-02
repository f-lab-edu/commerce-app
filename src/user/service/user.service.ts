import { Provider } from '@nestjs/common';
import { PersistedUserEntity } from '../entity/user.entity';
import { UserServiceImpl } from './user.serviceImpl';
import { UserEmailVO } from '../vo/email.vo';
import { UserRegistrationVO } from '../vo/userRegistration.vo';

export interface UserService {
  create(dto: UserRegistrationVO): Promise<PersistedUserEntity>;
  doesEmailExits(emailVO: UserEmailVO): Promise<boolean>;
}

export const UserServiceToken = Symbol('UserService');
export const UserServiceProvider: Provider<UserService> = {
  provide: UserServiceToken,
  useClass: UserServiceImpl,
};
