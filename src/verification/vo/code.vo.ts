import { BadRequestException } from '@nestjs/common';
import { randomInt } from 'crypto';

export class VeriCodeVO {
  static readonly constraints = {
    // code는 6자리 정수 제약조건입니다.
    maxLen: 6,
    get sixDigitPattern() {
      return `^[0-9]{${this.maxLen}}$`;
    },
    expireInMinute: 5,
  } as const;

  static generate() {
    const { maxLen } = this.constraints;
    const base = 10;
    const square = (base: number, n: number) => Math.pow(base, n);
    const max = square(base, maxLen);

    const begin = 0;
    const upperBoundExclusive = randomInt(begin, max);
    const fill = '0';
    const paddedSixDigitCode = upperBoundExclusive
      .toString()
      .padStart(maxLen, fill);

    return paddedSixDigitCode;
  }

  private _veriCode: string;

  constructor(code: string) {
    this.validateLength(code);
    this.validatePattern(code);
    this._veriCode = code;
  }

  private validateLength(code) {
    const { maxLen } = VeriCodeVO.constraints;
    if (code.length !== maxLen) {
      throw new BadRequestException(`인증코드는  ${maxLen}자 이어야 합니다.}`);
    }
  }

  private validatePattern(code: string) {
    const { sixDigitPattern } = VeriCodeVO.constraints;
    const isSixDigit = new RegExp(sixDigitPattern);
    if (!isSixDigit.test(code)) {
      throw new BadRequestException(`인증코드는 숫자만 포함해야합니다.`);
    }
  }

  get veriCode(): string {
    return this._veriCode;
  }
}
