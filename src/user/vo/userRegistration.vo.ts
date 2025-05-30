import { IUserInput } from '../interface/create.interface';
import { UserEmailVO } from './email.vo';
import { UserHashedPasswordVO } from './hashedPassword.vo';
import { UserNameVO } from './name.vo';

export class UserRegistrationVO {
  #email: UserEmailVO;
  #name: UserNameVO;
  #password: UserHashedPasswordVO;

  constructor(param: IUserInput) {
    this.#email = new UserEmailVO(param.email);
    this.#name = new UserNameVO(param.name);
    this.#password = new UserHashedPasswordVO(param.password);
  }

  get email() {
    return this.#email;
  }
  get name() {
    return this.#name;
  }
  get password() {
    return this.#password;
  }
}
