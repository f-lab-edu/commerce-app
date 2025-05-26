import { Column, Entity } from 'typeorm';
import { TRole } from '../types';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { UserConstraints } from './user.constraints';

export interface IUserEntity extends IBaseEntity {
  email: string;
  name: string;
  password: string;
  role?: TRole;
}

@Entity({ name: 'user' })
export class UserEntity extends MyBaseEntity implements IUserEntity {
  @Column({
    type: UserConstraints.DB_CONSTRAINTS.TYPE_VARCHAR,
    length: UserConstraints.EMAIL.MAX_LENGTH,
  })
  email: string;

  @Column({
    type: UserConstraints.DB_CONSTRAINTS.TYPE_VARCHAR,
    length: UserConstraints.NAME.MAX_LENGTH,
  })
  name: string;

  @Column({
    type: UserConstraints.DB_CONSTRAINTS.TYPE_VARCHAR,
    length: UserConstraints.PASSWORD.HASHED_MAX_LENGTH,
  })
  password: string;

  @Column({
    type: UserConstraints.DB_CONSTRAINTS.TYPE_VARCHAR,
    length: 10,
    default: 'buyer',
  })
  role: TRole = 'buyer';

  static from(param: IUserEntity) {
    const newUser = new UserEntity();
    const { createdAt, id, updatedAt, email, name, password, role } = param;
    newUser.id = id;
    newUser.createdAt = createdAt;
    newUser.updatedAt = updatedAt;

    newUser.email = email;
    newUser.name = name;
    newUser.password = password;
    newUser.role = role ?? 'buyer';

    return newUser;
  }
}
