import { BadRequestException } from '@nestjs/common';

export class UserNameVO {
  static readonly constraints = {
    minLen: 1,
    maxLen: 20,
    get alphaNumericBetweenOneToTwentyLengthPattern(): string {
      return `^[a-zA-Z0-9]{${this.minLen},${this.maxLen}}$`;
    },
  } as const;

  #name: string;

  constructor(name: string) {
    this.#validateLength(name);
    this.#validateNamePattern(name);

    this.#name = name;
  }

  #validateLength(name: string) {
    const { minLen, maxLen } = UserNameVO.constraints;
    if (name.length < minLen || name.length > maxLen) {
      throw new BadRequestException(
        `비밀번호의 길이는 ${minLen} ~ ${maxLen}자 이어야 합니다.}`,
      );
    }
  }

  #validateNamePattern(name: string) {
    const { alphaNumericBetweenOneToTwentyLengthPattern } =
      UserNameVO.constraints;
    const nameRegExp = new RegExp(alphaNumericBetweenOneToTwentyLengthPattern);

    if (!nameRegExp.test(name)) {
      throw new BadRequestException(`${name}은 올바른 이름 형식이 아닙니다.`);
    }
  }

  get name() {
    return this.#name;
  }
}
