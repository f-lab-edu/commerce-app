import { BadRequestException } from '@nestjs/common';

interface IPropertyConstraints {
  minLen?: number;
  maxLen?: number;
  pattern?: RegExp | string;
}

export class UserNameVO {
  static readonly constraints = {
    minLen: 1,
    maxLen: 20,
    get alphaNumericBetweenOneToTwentyLengthPattern(): string {
      return `^[a-zA-Z0-9]{${this.minLen},${this.maxLen}}$`;
    },
  };

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
        `이메일의 길이는 ${minLen} ~ ${maxLen}자 이어야 합니다.}`,
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
