import { IEmailVerificationEntity } from '../../auth/interface/emailVerification.interface';
import { EmailVerificationEntity } from '../entity/emailVerification.entity';

export class EmailVerificationMapper {
  static toEntity(dto: IEmailVerificationEntity) {
    return new EmailVerificationEntity(dto);
  }
}
