import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePolicy } from '../../../common/policy/policy';
import { SignUpDto } from '../../dto/signup.dto';

@Injectable()
export class SignUpPolicyImpl extends BasePolicy<SignUpDto> {
  protected async executeValidationRules() {
    this.#emailPasswordNotSame();
  }

  #emailPasswordNotSame() {
    const { email, password } = this.validationTarget;
    if (email === password) {
      throw new BadRequestException(
        `이메일과 비밀번호는 달라야합니다. 입력된 이메일: ${email}. `,
      );
    }
  }
}
