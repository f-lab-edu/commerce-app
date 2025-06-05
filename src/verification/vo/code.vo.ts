import { BadRequestException } from '@nestjs/common';

export class VeriCodeVO {
  static readonly constraints = {
    // code는 6자리 정수 제약조건입니다.
    maxLen: 6,
    get sixDigitPattern() {
      return `^[0-9]{${this.maxLen}}$`;
    },
    expireInMinute: 5,
  } as const;

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
    if (!isSixDigit) {
      throw new BadRequestException(`인증코드는 숫자만 포함해야합니다.`);
    }
  }

  get veriCode(): string {
    return this._veriCode;
  }
}
