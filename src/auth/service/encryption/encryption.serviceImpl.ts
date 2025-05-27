import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionServiceImpl {
  constructor(private readonly configService: ConfigService) {}

  private toDecimalInteger(strNum: string) {
    const decimalRadix = 10;
    return parseInt(strNum, decimalRadix);
  }

  async hash(password: string): Promise<string> {
    const saltRound = this.configService.get<string>('SALTROUND');
    if (!saltRound) {
      throw new Error('SaltRound가 정의되지 않았습니다.');
    }

    const parsed = this.toDecimalInteger(saltRound);
    if (isNaN(parsed)) {
      throw new Error(`${saltRound}는 문자타입의 숫자가 아닙니다.`);
    }

    return await bcrypt.hash(password, parsed);
  }
}
