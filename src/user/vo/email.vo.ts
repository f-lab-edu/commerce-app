import { BadRequestException } from '@nestjs/common';

export class UserEmailVO {
  static readonly constraints = {
    minLen: 1,
    maxLen: 255,
  };
  #email: string;

  constructor(email: string) {
    if (
      email.length < UserEmailVO.constraints.minLen ||
      email.length > UserEmailVO.constraints.maxLen
    ) {
      throw new BadRequestException(
        `이메일의 길이는 ${UserEmailVO.constraints.minLen} ~ ${UserEmailVO.constraints.maxLen}자 이어야 합니다.}`,
      );
    }

    this.#email = email;
  }

  get email(): string {
    return this.#email;
  }
}
