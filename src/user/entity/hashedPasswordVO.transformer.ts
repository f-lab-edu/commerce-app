import { ValueTransformer } from 'typeorm';
import { UserHashedPasswordVO } from '../vo/hashedPassword.vo';

export class HashedPasswordVOTransformer implements ValueTransformer {
  from(dbValue: string | null | undefined): UserHashedPasswordVO | null {
    if (!dbValue) {
      return null;
    }

    try {
      return new UserHashedPasswordVO(dbValue);
    } catch (error) {
      console.error(
        `${dbValue}로 ${UserHashedPasswordVO.name} 생성을 실패했습니다.`,
      );
      return null;
    }
  }

  to(value: UserHashedPasswordVO | null | undefined) {
    if (!value) {
      return null;
    }

    return value.hashedPassword;
  }
}
