import { IBaseEntity } from '../../common/entity/base';
import { TVerificationStatus } from '../../verification/entity/types';
import { VeriCodeVO } from '../../verification/vo/code.vo';

export interface IVerificationEntity extends IBaseEntity {
  code: VeriCodeVO;
  status: TVerificationStatus;
  expiredAt: Date;
  verifiedAt: Date | null;
  errorMessage: string | null;
}
type RawVerificationInput = { code: string };
export type IVerificationInput = Omit<IVerificationEntity, 'code'> &
  RawVerificationInput;

type EmailInput = { email: string };
export type IEmailVerificationInput = IVerificationInput & EmailInput;
