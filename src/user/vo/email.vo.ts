import { BadRequestException } from '@nestjs/common';

export class UserEmailVO {
  static readonly constraints = {
    minLen: 2,
    maxLen: 255,
    emailPattern: `^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,255}$`,
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

  get email(): string {
    return this.#email;
  }
}
