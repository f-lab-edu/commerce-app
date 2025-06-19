import { BadRequestException } from '@nestjs/common';
import { randomInt } from 'crypto';
import * as dayjs from 'dayjs';

export abstract class ValueObject<T> {
  constructor(protected readonly props: T) {}

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.constructor !== this.constructor) return false;

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}

// code는 6자리 정수 제약조건입니다.
const CODE_LEN_CONSTRAINT = 6;
export class VeriCodeVO extends ValueObject<{
  code: string;
}> {
  static readonly constraints = {
    maxLen: CODE_LEN_CONSTRAINT,
    sixDigitPattern: `^[0-9]{${CODE_LEN_CONSTRAINT}}$`,
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
  private _expiredAt: Date;

  constructor(code: string) {
    super({ code });
    this.validateLength(code);
    this.validatePattern(code);
    this._veriCode = code;
    this.setExpiredAt();
  }

  private setExpiredAt() {
    this._expiredAt = dayjs()
      .add(VeriCodeVO.constraints.expireInMinute, 'minute')
      .toDate();
  }

  private validateLength(code: string) {
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

  get expiredAt(): Date {
    return this._expiredAt;
  }
}
