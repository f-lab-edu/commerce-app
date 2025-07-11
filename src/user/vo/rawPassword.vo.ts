import { BadRequestException } from '@nestjs/common';

export class UserRawPasswordVO {
  static readonly constraints = {
    minLen: 8,
    maxLen: 20,

    get atLeastTwoCombinationsPattern() {
      const alphaNumericPattern = '(?=.*[A-Za-z])(?=.*\\d)';
      const alphaSpecialCharPattern = '(?=.*[A-Za-z])(?=.*[!@#$%^&*?_])';
      const numberSpecialCharPattern = '(?=.*\\d)(?=.*[!@#$%^&*?_])';
      const allCharsInPassword = '[A-Za-z\\d!@#$%^&*?_]';
      const OR = '|';
      const BETWEEN = (min: number, max: number) => `{${min},${max}}$`;

      return (
        '^(?:' +
        alphaNumericPattern +
        OR +
        alphaSpecialCharPattern +
        OR +
        numberSpecialCharPattern +
        ')' +
        allCharsInPassword +
        BETWEEN(this.minLen, this.maxLen)
      );
    },
  } as const;

  #rawPassword: string;

  constructor(password: string) {
    this.#validateLength(password);
    this.#validatePasswordPattern(password);
    this.#rawPassword = password;
  }

  #validateLength(password: string) {
    const { minLen, maxLen } = UserRawPasswordVO.constraints;
    if (password.length < minLen || password.length > maxLen) {
      throw new BadRequestException(
        `비밀번호의 길이는 ${minLen} ~ ${maxLen}자 이어야 합니다.}`,
      );
    }
  }

  #validatePasswordPattern(password: string) {
    const { atLeastTwoCombinationsPattern } = UserRawPasswordVO.constraints;
    const passwordRegExp = new RegExp(atLeastTwoCombinationsPattern);
    if (!passwordRegExp.test(password)) {
      throw new BadRequestException(
        `비밀번호는 영문/숫자/특수문자(!@#$%^&*?_) 중 2가지 이상을 조합하여 (${UserRawPasswordVO.constraints.minLen} ~ ${UserRawPasswordVO.constraints.maxLen}자) 조건을 만족해야 합니다.`,
      );
    }
  }

  get rawPassword() {
    return this.#rawPassword;
  }
}
