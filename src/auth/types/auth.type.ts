import { PersistedUserEntity } from '../../user/entity/user.entity';

export type LoginResData = {
  accessToken: string;
  refreshToken: string;
  user: PersistedUserEntity;
};

export type JwtConfigs = {
  secret: string;
  expiresIn: string;
};
export type JwtConfigData = Record<
  'accessJwtConfig' | 'refreshJwtConfig',
  JwtConfigs
>;
