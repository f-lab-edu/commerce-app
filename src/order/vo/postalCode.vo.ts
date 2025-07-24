import { InitializationException } from '../../common/exception/internal.exception';

/**
 * 대한민국의 우편번호 체계는 5자리입니다.
 */
const POSTAL_CODE_MIN_LEN = 1;
const POSTAL_CODE_MAX_LEN = 5;
export class PostalCodeVO {
  static readonly constraints = {
    minLen: POSTAL_CODE_MIN_LEN,
    maxLen: POSTAL_CODE_MAX_LEN,
  } as const;

  constructor(private postalCode: string) {}

  valueOf() {
    return this.postalCode;
  }

  static from(postalCodeInput: string) {
    const postalCode = postalCodeInput.trim();
    if (
      postalCode.length < this.constraints.maxLen ||
      postalCode.length > this.constraints.maxLen
    ) {
      throw new InitializationException(
        `${PostalCodeVO.name} 초기화 중 문제가 발생했어요. 우편번호의 길이는 ${this.constraints.minLen} ~ ${this.constraints.maxLen} 사이여야 합니다.`,
      );
    }

    return new PostalCodeVO(postalCode);
  }
}
