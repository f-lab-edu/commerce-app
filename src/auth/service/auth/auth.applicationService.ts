import { Provider } from '@nestjs/common';
import { PersistedUserEntity } from '../../../user/entity/user.entity';
import { AuthApplicationServiceImpl } from './auth.applicationServiceImpl';
import { IUserInput } from '../../../user/interface/create.interface';
import { LoginCommand } from '../../command/login.command';
import { LoginResData } from '../../types/auth.type';

export interface AuthApplicationService {
  signUp(dto: IUserInput): Promise<PersistedUserEntity>;
  login(dto: LoginCommand): Promise<LoginResData>;
}

export const AuthApplicationServiceToken = Symbol('AuthApplicationService');
export const AuthApplicationServiceProvider: Provider<AuthApplicationService> =
  {
    provide: AuthApplicationServiceToken,
    useClass: AuthApplicationServiceImpl,
  };
