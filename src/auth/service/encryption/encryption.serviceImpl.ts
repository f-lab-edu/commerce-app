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
      throw new Error(`SaltRound는 숫자로 변환할 수 있는 문자열이어야 합니다.`);
    }
    return parsed;
  }

  #getSaltRound() {
    const saltRoundEnvKey = 'SALTROUND';
    const saltRound = this.configService.get<string>(saltRoundEnvKey);
    if (!saltRound) {
      throw new Error(
        `Salt Round 환경변수가 정의되지 않았습니다. ${saltRoundEnvKey} 환경변수를 정의해 주세요. `,
      );
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
