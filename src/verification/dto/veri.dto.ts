import { Expose } from 'class-transformer';
import { BaseResponseDto } from '../../common/dto/base.dto';
import { TVerificationStatus } from '../entity/types';
import { PersistedEmailVerificationEntity } from '../entity/emailVerification.entity';

export class VerificationResponseDto extends BaseResponseDto {
  @Expose()
  email: string;

  @Expose()
  code: string;

  @Expose()
  status: TVerificationStatus;

  @Expose()
  expiredAt: Date;

  @Expose()
  verifiedAt: Date | null;

  @Expose()
  errorMessage: string | null;

  constructor(param: PersistedEmailVerificationEntity) {
    super(param);
    const { code, email, errorMessage, expiredAt, status, verifiedAt } = param;
    this.email = email.valueOf();
    this.code = code.veriCode;
    this.expiredAt = expiredAt;
    this.status = status;
    this.verifiedAt = verifiedAt;
    this.errorMessage = errorMessage;
  }
}
