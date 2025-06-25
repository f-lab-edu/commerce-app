import { VeriCodeVO } from '../vo/code.vo';

export interface VeriSendStrategy {
  send(to: string, code: VeriCodeVO): Promise<void>;
}
