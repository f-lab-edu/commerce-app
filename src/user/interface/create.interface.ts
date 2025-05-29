export interface ICreateUserDto {
  email: string;
  name: string;
  password: string;
}

export class CreateUserDto implements ICreateUserDto {
  #email: string;
  #name: string;
  #password: string;
  constructor(param: ICreateUserDto) {
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
