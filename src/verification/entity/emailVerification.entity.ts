import { Column, Entity } from 'typeorm';
import { VerificationEntity } from './verification.entity';
import { IEmailVerificationEntity } from '../../auth/interface/emailVerification.interface';

@Entity({ name: 'email_verification' })
export class EmailVerificationEntity
  extends VerificationEntity
  implements IEmailVerificationEntity
{
  @Column({ type: 'varchar', length: 255 })
  email: string;

  constructor(param?: IEmailVerificationEntity) {
    super(param);
    if (param) {
      this.email = param.email;
    }
  }
}
