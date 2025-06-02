import { Column } from 'typeorm';
import { MyBaseEntity } from '../../common/entity/base';
import { IVerificationEntity } from '../../auth/interface/verification.interface';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { VeriCodeVO } from '../vo/code.vo';
import { VeriCodeVOTransformer } from './vericodeVO.transformer';

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

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'datetime' })
  expiredAt: Date;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt: Date | null;

  constructor(param?: IVerificationEntity) {
    super(param);
    if (param) {
      this.code = param.code;
      this.isVerified = param.isVerified ?? false;
      this.expiredAt = param.expiredAt;
      this.verifiedAt = param.verifiedAt;
    }
  }
}
