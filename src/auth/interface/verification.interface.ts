import { IBaseEntity } from '../../common/entity/base';
import { VeriCodeVO } from '../../verification/vo/code.vo';

export interface IVerificationEntity extends IBaseEntity {
  code: VeriCodeVO;
  isVerified: boolean;
  expiredAt: Date;
  verifiedAt: Date | null;
}
type RawVerificationInput = { code: string };
export type IVerificationInput = Omit<IVerificationEntity, 'code'> &
  RawVerificationInput;

type EmailInput = { email: string };
export type IEmailVerificationInput = IVerificationInput & EmailInput;
