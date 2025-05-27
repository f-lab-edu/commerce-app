import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionServiceImpl {
  constructor(private readonly configService: ConfigService) {}

  private toDecimalInteger(strNum: string) {
    const decimalRadix = 10;
    const parsed = parseInt(strNum, decimalRadix);
    if (isNaN(parsed)) {
      throw new Error(`${strNum}는 문자타입의 숫자가 아닙니다.`);
    }
    return parsed;
  }

  private getSaltRound() {
    const saltRound = this.configService.get<string>('SALTROUND');
    if (!saltRound) {
      throw new Error('SaltRound가 정의되지 않았습니다.');
    }
    return saltRound;
  }

  async hash(password: string): Promise<string> {
    const saltRound = this.getSaltRound();
    const parsed = this.toDecimalInteger(saltRound);
    return await bcrypt.hash(password, parsed);
  }
}
