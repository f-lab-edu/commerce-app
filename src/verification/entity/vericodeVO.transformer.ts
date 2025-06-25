import { ValueTransformer } from 'typeorm';
import { VeriCodeVO } from '../vo/code.vo';

export class VeriCodeVOTransformer implements ValueTransformer {
  from(dbValue: string | null | undefined) {
    if (!dbValue) {
      return null;
    }

    try {
      return new VeriCodeVO(dbValue);
    } catch (error) {
      console.error(`${dbValue}로 ${VeriCodeVO.name} 생성을 실패했습니다.`);
      return null;
    }
  }

  to(value: VeriCodeVO | null | undefined) {
    if (!value) {
      return null;
    }

    return value.veriCode;
  }
}
