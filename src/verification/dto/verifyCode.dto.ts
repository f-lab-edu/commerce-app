import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { VeriCodeVO } from '../vo/code.vo';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(VeriCodeVO.constraints.maxLen)
  code: string;
}
