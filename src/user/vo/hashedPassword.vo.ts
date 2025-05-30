import { BadRequestException } from '@nestjs/common';

export class UserHashedPasswordVO {
  static readonly constraints = {
    minLen: 8,
    maxLen: 255,
  } as const;

  #hashedPassword: string;

  constructor(password: string) {
    this.#validateLength(password);
    this.#hashedPassword = password;
  }

  #validateLength(password: string) {
    const { minLen, maxLen } = UserHashedPasswordVO.constraints;
    if (password.length < minLen || password.length > maxLen) {
      throw new BadRequestException(
        `비밀번호의 길이는 ${minLen} ~ ${maxLen}자 이어야 합니다.}`,
      );
    }
  }

  get hashedPassword() {
    return this.#hashedPassword;
  }
}
