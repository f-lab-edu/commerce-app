import { BadRequestException } from '@nestjs/common';

export class UserEmailVO {
  static readonly constraints = {
    minLen: 1,
    maxLen: 255,
    emailPattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/,
  };
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
        `이메일의 길이는 ${UserEmailVO.constraints.minLen} ~ ${UserEmailVO.constraints.maxLen}자 이어야 합니다.}`,
      );
    }
  }

  #validateEmailPattern(email: string) {
    const { emailPattern } = UserEmailVO.constraints;
    if (emailPattern.test(email)) {
      throw new BadRequestException(
        `${email}은 올바른 이메일 형식이 아닙니다.`,
      );
    }
  }

  get email(): string {
    return this.#email;
  }
}
