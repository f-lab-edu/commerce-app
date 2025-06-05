import { Provider } from '@nestjs/common';
import { PersistedUserEntity } from '../../../user/entity/user.entity';
import { AuthApplicationServiceImpl } from './authApplication.serviceImpl';
import { IUserInput } from '../../../user/interface/create.interface';

export interface AuthApplicationService {
  signUp: (dto: IUserInput) => Promise<PersistedUserEntity>;
}

export const AuthApplicationServiceToken = Symbol('AuthApplicationService');
export const AuthApplicationServiceProvider: Provider<AuthApplicationService> =
  {
    provide: AuthApplicationServiceToken,
    useClass: AuthApplicationServiceImpl,
  };
