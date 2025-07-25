export interface IUserInput {
  email: string;
  name: string;
  password: string;
}

export type UserLoginInput = Omit<IUserInput, 'name'>;
