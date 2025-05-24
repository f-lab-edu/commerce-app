import { Column, Entity } from 'typeorm';
import { MyBaseEntity } from '../../common/entity/base';
import { IVerificationEntity } from '../../auth/interface/verification.interface';

export abstract class VerificationEntity
  extends MyBaseEntity
  implements IVerificationEntity
{
  @Column({ type: 'varchar', length: 255 })
  code: string;

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
