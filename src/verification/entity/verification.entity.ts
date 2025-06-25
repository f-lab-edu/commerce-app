import { Column } from 'typeorm';
import { MyBaseEntity } from '../../common/entity/base';
import { IVerificationEntity } from '../../auth/interface/verification.interface';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { VeriCodeVO } from '../vo/code.vo';
import { VeriCodeVOTransformer } from './vericodeVO.transformer';
import { TVerificationStatus, VERIFICATION_STATUS } from './types';

export abstract class VerificationEntity
  extends MyBaseEntity
  implements IVerificationEntity
{
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    length: VeriCodeVO.constraints.maxLen,
    transformer: new VeriCodeVOTransformer(),
  })
  code: VeriCodeVO;

  @Column({
    type: 'enum',
    default: VERIFICATION_STATUS.PENDING,
    enum: VERIFICATION_STATUS,
  })
  status: TVerificationStatus;

  @Column({ type: 'datetime' })
  expiredAt: Date;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  constructor(param?: IVerificationEntity) {
    super(param);
    if (param) {
      this.code = param.code;
      this.status = param.status ?? VERIFICATION_STATUS.PENDING;
      this.expiredAt = param.expiredAt;
      this.verifiedAt = param.verifiedAt;
      this.errorMessage = param.errorMessage;
    }
  }
}
