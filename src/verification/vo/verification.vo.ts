import { UserEmailVO } from '../../user/vo/email.vo';
import { UserPhoneVO } from '../../user/vo/phone.vo';
import {
  VERIFICATION_CHANNELS,
  VerificationChannel,
} from '../command/sendCode.command';
import { Verificationable } from '../strategy/veriSendStrategy.interface';

export class VerificationVO {
  private readonly contact: Verificationable;
  private readonly channel: VerificationChannel;

  constructor(contact: Verificationable, channel: VerificationChannel) {
    this.contact = contact;
    this.channel = channel;
  }

  getContact(): Verificationable {
    return this.contact;
  }

  getChannel(): VerificationChannel {
    return this.channel;
  }

  static from(contact: string, channel: VerificationChannel) {
    if (channel === VERIFICATION_CHANNELS.email) {
      return new VerificationVO(new UserEmailVO(contact), channel);
    } else {
      return new VerificationVO(new UserPhoneVO(contact), channel);
    }
  }
}
