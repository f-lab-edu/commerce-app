import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BasePolicyService } from '../../../common/policy/policy';
import { SignUpDto } from '../../dto/signup.dto';
import { VerificationService } from '../../../verification/verification.service';

@Injectable()
export class SignUpPolicyServiceImpl extends BasePolicyService<SignUpDto> {
  protected async executeValidationRules() {
    this.emailPasswordNotSame();
  }

  private emailPasswordNotSame() {
    const { email, password } = this.validationTarget;
    if (email === password) {
      throw new BadRequestException(
        `이메일과 비밀번호는 달라야합니다. 입력된 이메일: ${email}. `,
      );
    }
  }
}
