import { BadRequestException } from '@nestjs/common';

const NAME_MIN_LEN_CONSTRAINT = 1;
const NAME_MAX_LEN_CONSTRAINT = 20;
export class UserNameVO {
  static readonly constraints = {
    minLen: NAME_MIN_LEN_CONSTRAINT,
    maxLen: NAME_MAX_LEN_CONSTRAINT,
    alphaNumericBetweenOneToTwentyLengthPattern: `^[a-zA-Z0-9]{${NAME_MIN_LEN_CONSTRAINT},${NAME_MAX_LEN_CONSTRAINT}}$`,
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
        `이름의 길이는 ${minLen} ~ ${maxLen}자 이어야 합니다.}`,
      );
    }
  }

  #validateNamePattern(name: string) {
    const { alphaNumericBetweenOneToTwentyLengthPattern } =
      UserNameVO.constraints;
    const nameRegExp = new RegExp(alphaNumericBetweenOneToTwentyLengthPattern);

    if (!nameRegExp.test(name)) {
      throw new BadRequestException(
        `${name}은 올바른 이름 형식이 아닙니다. 이름은 영문/숫자를 포함하여 ${UserNameVO.constraints.minLen} ~ ${UserNameVO.constraints.maxLen}자 이내여야 합니다`,
      );
    }
  }

  get name() {
    return this.#name;
  }
}
