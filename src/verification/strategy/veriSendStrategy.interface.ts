import { VerificationChannel } from '../command/sendCode.command';
import { VeriCodeVO } from '../vo/code.vo';
import { VerificationVO } from '../vo/verification.vo';

export interface Verificationable {
  getContactType(): VerificationChannel;
}
export interface VeriSendStrategy {
  send(to: VerificationVO, code: VeriCodeVO): Promise<void>;
}
