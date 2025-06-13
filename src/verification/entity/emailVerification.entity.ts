import { Column, Entity } from 'typeorm';
import { VerificationEntity } from './verification.entity';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { UserEmailVO } from '../../user/vo/email.vo';
import { EmailVOTransformer } from '../../user/entity/emailVO.transformer';
import { IVerificationEntity } from '../../auth/interface/verification.interface';

export interface IEmailVerificationEntity extends IVerificationEntity {
  email: UserEmailVO;
}

export type PersistedEmailVerificationEntity =
  Required<IEmailVerificationEntity>;

@Entity({ name: 'email_verification' })
export class EmailVerificationEntity
  extends VerificationEntity
  implements IEmailVerificationEntity
{
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    length: UserEmailVO.constraints.maxLen,
    transformer: new EmailVOTransformer(),
  })
  email: UserEmailVO;

  constructor(param?: IEmailVerificationEntity) {
    super(param);
    if (param) {
      this.email = param.email;
    }
  }
}
