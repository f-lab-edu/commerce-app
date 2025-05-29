import { ValueTransformer } from 'typeorm';
import { UserEmailVO } from '../vo/email.vo';

export class EmailTransformer implements ValueTransformer {
  from(dbValue: string | null | undefined): UserEmailVO | null {
    if (!dbValue) {
      return null;
    }

    try {
      return new UserEmailVO(dbValue);
    } catch (error) {
      console.error(`${dbValue}로 UserEmailVO 생성을 실패했습니다.`);
      return null;
    }
  }

  to(value: UserEmailVO | null | undefined): string | null {
    if (!value) {
      return null;
    }

    return value.email;
  }
}
