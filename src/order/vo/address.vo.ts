import { InitializationException } from '../../common/exception/internal.exception';

const ADDRESS_MIN_LEN = 1;
const ADDRESS_MAX_LEN = 255;
export class AddressVO {
  static readonly constraints = {
    minLen: ADDRESS_MIN_LEN,
    maxLen: ADDRESS_MAX_LEN,
  } as const;

  constructor(private address: string) {}

  valueOf() {
    return this.address;
  }

  static from(addressInput: string) {
    const address = addressInput.trim();
    if (
      address.length < this.constraints.minLen ||
      address.length > this.constraints.maxLen
    ) {
      throw new InitializationException({
        clientMsg: `${AddressVO.name} 초기화 중 문제가 발생했어요. 주소의 길이는 ${this.constraints.minLen} ~ ${this.constraints.maxLen} 사이여야 합니다.`,
      });
    }

    return new AddressVO(address);
  }
}
