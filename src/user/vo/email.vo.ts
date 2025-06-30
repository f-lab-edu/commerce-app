import { BadRequestException } from '@nestjs/common';
import { Verificationable } from '../../verification/strategy/veriSendStrategy.interface';
import {
  VERIFICATION_CHANNELS,
  VerificationChannel,
} from '../../verification/command/sendCode.command';

const EMAIL_MIN_LEN_CONSTRAINT = 2;
const EMAIL_MAX_LEN_CONSTRAINT = 255;
export class UserEmailVO implements Verificationable {
  static readonly constraints = {
    minLen: EMAIL_MIN_LEN_CONSTRAINT,
    maxLen: EMAIL_MAX_LEN_CONSTRAINT,
    emailPattern: `^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{${EMAIL_MIN_LEN_CONSTRAINT},${EMAIL_MAX_LEN_CONSTRAINT}}$`,
  } as const;
  #email: string;

  constructor(email: string) {
    this.#validateLength(email);
    this.#validateEmailPattern(email);

    this.#email = email;
  }

  #validateLength(email: string) {
    const { maxLen, minLen } = UserEmailVO.constraints;
    if (email.length < minLen || email.length > maxLen) {
      throw new BadRequestException(
        `이메일의 길이는 ${minLen} ~ ${maxLen}자 이어야 합니다.}`,
      );
    }
  }

  #validateEmailPattern(email: string) {
    const { emailPattern } = UserEmailVO.constraints;
    const emailRegExp = new RegExp(emailPattern);
    if (!emailRegExp.test(email)) {
      throw new BadRequestException(
        `${email}은 올바른 이메일 형식이 아닙니다. 이메일은 유효한 형식이어야합니다. (예: user@example.com) `,
      );
    }
  }

  valueOf() {
    return this.#email;
  }

  getContactType(): VerificationChannel {
    return VERIFICATION_CHANNELS.email;
  }
}
