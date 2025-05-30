import { Provider } from '@nestjs/common';
import { PersistedUserEntity } from '../../../user/entity/user.entity';
import { AuthServiceImpl } from './auth.serviceImpl';
import { IUserInput } from '../../../user/interface/create.interface';

export interface AuthService {
  signUp: (dto: IUserInput) => Promise<PersistedUserEntity>;
}

export const AuthServiceToken = Symbol('AuthService');
export const AuthServiceProvider: Provider<AuthService> = {
  provide: AuthServiceToken,
  useClass: AuthServiceImpl,
};
