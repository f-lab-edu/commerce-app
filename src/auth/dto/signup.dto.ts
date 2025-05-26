import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entity/user.entity';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { CreateUserDto } from '../../user/interface/create.interface';
import { UserConstraints } from '../../user/entity/user.constraints';

export class SignUpDto
  extends PickType(UserEntity, ['email', 'name', 'password'] as const)
  implements CreateUserDto
{
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @Length(UserConstraints.EMAIL.MIN_LENGTH, UserConstraints.EMAIL.MAX_LENGTH, {
    message: `이메일의 길이는 ${UserConstraints.EMAIL.MIN_LENGTH} ~ ${UserConstraints.EMAIL.MAX_LENGTH}입니다.`,
  })
  email: string;

  @IsString()
  @Matches(
    new RegExp(UserConstraints.NAME.alphaNumericBetweenOneToTwentyLengthRule),
    {
      message: `닉네임은 공백,특수문자를 제외한 숫자,문자 조합 (${UserConstraints.NAME.MIN_LENGTH} ~ ${UserConstraints.NAME.MAX_LENGTH}자)조건을 만족해야합니다.`,
    },
  )
  name: string;

  @IsString()
  @Matches(new RegExp(UserConstraints.PASSWORD.atLeastTwoTypesOfPatternRule), {
    message: `비밀번호는 영문/숫자/특수문자 2가지 이상 조합 (${UserConstraints.PASSWORD.MIN_LENGTH} ~ ${UserConstraints.PASSWORD.MAX_LENGTH}자) 조건을 만족해야 합니다.`,
  })
  password: string;
}
