export interface IUserInput {
  email: string;
  name: string;
  password: string;
}

export class CreateUserDto implements IUserInput {
  #email: string;
  #name: string;
  #password: string;
  constructor(param: IUserInput) {
    const { email, name, password } = param;
    this.#email = email;
    this.#name = name;
    this.#password = password;
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
