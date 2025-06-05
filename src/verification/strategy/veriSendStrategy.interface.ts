import { VeriCodeVO } from '../vo/code.vo';

export interface VeriSendStrategy {
  send(target: string, code: VeriCodeVO): Promise<void>;
  saveVerification(target: string, code: VeriCodeVO): Promise<void>;
}
