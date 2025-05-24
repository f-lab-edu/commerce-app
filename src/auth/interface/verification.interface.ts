import { IBaseEntity } from '../../common/entity/base';

export interface IVerificationEntity extends IBaseEntity {
  code: string;
  isVerified?: boolean;
  expiredAt: Date;
  verifiedAt: Date | null;
}
