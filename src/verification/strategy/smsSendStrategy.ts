import { Injectable, NotImplementedException } from '@nestjs/common';
import { VeriSendStrategy } from './veriSendStrategy.interface';
import { VeriCodeVO } from '../vo/code.vo';
import { UserPhoneVO } from '../../user/vo/phone.vo';
import { VerificationVO } from '../vo/verification.vo';

/**
 * 회원가입시 인증번호 발송 로직 구현할때
 * 이메일 발송을 기본으로 고려를 했는데 고민을 해보니
 * SMS도 선택적으로 발송할 수 있겠다고 생각을 했습니다.
 * 인증번호 발송 수단을 유연하게 늘릴 수 있는 코드를 구현하기 위해서
 * 실제 구현은 없지만 SMS 발송 클래스를 틀만 잡았습니다.
 */

@Injectable()
export class SmsSendStrategy implements VeriSendStrategy {
  constructor() {}

  async saveVerification(to: string, code: VeriCodeVO): Promise<void> {
    throw new NotImplementedException();
  }

  async send(to: VerificationVO, code: VeriCodeVO): Promise<void> {
    throw new NotImplementedException();
  }
}
