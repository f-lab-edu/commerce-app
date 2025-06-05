import { ValueTransformer } from 'typeorm';
import { UserNameVO } from '../vo/name.vo';

export class NameVOTransformer implements ValueTransformer {
  from(dbValue: string | null | undefined): UserNameVO | null {
    if (!dbValue) {
      return null;
    }

    try {
      return new UserNameVO(dbValue);
    } catch (error) {
      console.error(`${dbValue}로 ${UserNameVO.name} 생성을 실패했습니다.`);
      return null;
    }
  }

  to(value: UserNameVO | null | undefined) {
    if (!value) {
      return null;
    }

    return value.name;
  }
}
