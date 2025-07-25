import { UserEmailVO } from '../../user/vo/email.vo';
import { UserRawPasswordVO } from '../../user/vo/rawPassword.vo';

export class LoginCommand {
  constructor(
    private readonly _email: UserEmailVO,
    private readonly _password: UserRawPasswordVO,
  ) {}

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }
}
