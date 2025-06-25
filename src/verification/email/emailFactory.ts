import { UserEmailVO } from '../../user/vo/email.vo';
import { VeriCodeVO } from '../vo/code.vo';
import { EmailOptionVO } from '../vo/emailOption.vo';
import { HTMLContentVO } from '../vo/html.vo';

export class EmailFactory {
  static createVerificationEmail(code: VeriCodeVO, email: UserEmailVO) {
    const subject = '회원가입 인증 코드입니다.';
    const html = new HTMLContentVO(`
            <div>
                <p>이메일 인증코드: ${code.veriCode} </p>
                <p>인증코드는 ${VeriCodeVO.constraints.expireInMinute}분간 유효합니다.</p>
            </div>
        `);

    return new EmailOptionVO(email, subject, html);
  }
}
