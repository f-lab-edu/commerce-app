import {
  VERIFICATION_CHANNELS,
  VerificationChannel,
} from '../../verification/command/sendCode.command';
import { Verificationable } from '../../verification/strategy/veriSendStrategy.interface';

/**
 * verification을 email과 SMS를 구분해놓았고
 * 현재는 이메일만 구현이 되어있습니다.
 * 이메일이 값 객체, 전화번호는 string으로 처리중
 * 다형성을 위해서 전화번호도 값 객체로 처리합니다.
 */
export class UserPhoneVO implements Verificationable {
  constructor(phone: string) {}
  valueOf() {
    return {} as any;
  }

  getContactType(): VerificationChannel {
    return VERIFICATION_CHANNELS.sms;
  }
}
