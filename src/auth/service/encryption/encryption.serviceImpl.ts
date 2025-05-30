import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserHashedPasswordVO } from '../../../user/vo/hashedPassword.vo';
import { UserRawPasswordVO } from '../../../user/vo/rawPassword.vo';

@Injectable()
export class EncryptionServiceImpl {
  constructor(private readonly configService: ConfigService) {}

  #toDecimalInteger(strNum: string) {
    const decimalRadix = 10;
    const parsed = parseInt(strNum, decimalRadix);
    if (isNaN(parsed)) {
      throw new Error(`${strNum}는 문자타입의 숫자가 아닙니다.`);
    }
    return parsed;
  }

  #getSaltRound() {
    const saltRound = this.configService.get<string>('SALTROUND');
    if (!saltRound) {
      throw new Error('SaltRound가 정의되지 않았습니다.');
    }
    return saltRound;
  }

  async hash(password: UserRawPasswordVO): Promise<UserHashedPasswordVO> {
    const saltRound = this.#getSaltRound();
    const parsed = this.#toDecimalInteger(saltRound);
    const hashed = await bcrypt.hash(password.rawPassword, parsed);
    return new UserHashedPasswordVO(hashed);
  }
}
