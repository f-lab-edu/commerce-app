import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IUserInput } from '../../user/interface/create.interface';
import { UserEmailVO } from '../../user/vo/email.vo';
import { UserNameVO } from '../../user/vo/name.vo';
import { UserRawPasswordVO } from '../../user/vo/rawPassword.vo';

export class SignUpDto implements IUserInput {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @Length(UserEmailVO.constraints.minLen, UserEmailVO.constraints.maxLen, {
    message: `이메일의 길이는 ${UserEmailVO.constraints.minLen} ~ ${UserEmailVO.constraints.maxLen}입니다.`,
  })
  email: string;

  @IsString()
  @Matches(
    new RegExp(
      UserNameVO.constraints.alphaNumericBetweenOneToTwentyLengthPattern,
    ),
    {
      message: `이름은 공백,특수문자를 제외한 숫자,문자 조합 (${UserNameVO.constraints.minLen} ~ ${UserNameVO.constraints.maxLen}자)조건을 만족해야합니다.`,
    },
  )
  name: string;

  @IsString()
  @Matches(
    new RegExp(UserRawPasswordVO.constraints.atLeastTwoCombinationsPattern),
    {
      message: `비밀번호는 영문/숫자/특수문자 2가지 이상 조합 (${UserRawPasswordVO.constraints.minLen} ~ ${UserRawPasswordVO.constraints.maxLen}자) 조건을 만족해야 합니다.`,
    },
  )
  password: string;
}
