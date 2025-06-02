import { IEmailVerificationInput, IVerificationInput } from '../../auth/interface/verification.interface';
import { UserEmailVO } from '../../user/vo/email.vo';
import { EmailVerificationEntity } from '../entity/emailVerification.entity';
import { VeriCodeVO } from '../vo/code.vo';

export class EmailVerificationMapper {
  static toEntity(dto: IEmailVerificationInput) {
    const {code,email} = dto;
    return new EmailVerificationEntity({
      code: new VeriCodeVO(code),
      email: new UserEmailVO(email),
      isVerified: false,
      expiredAt: 

    });
  }
}
