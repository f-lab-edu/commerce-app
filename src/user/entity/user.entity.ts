import { Column, Entity } from 'typeorm';
import { TRole } from '../types';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { UserConstraints } from './user.constraints';
import { UserEmailVO } from '../vo/email.vo';
import { EmailVOTransformer } from './emailVO.transformer';
import { UserNameVO } from '../vo/name.vo';
import { NameVOTransformer } from './nameVO.transformer';

export interface IUserEntity extends IBaseEntity {
  email: UserEmailVO;
  name: UserNameVO;
  password: string;
  role?: TRole;
}

export type PersistedUserEntity = Required<IUserEntity>;

@Entity({ name: 'user' })
export class UserEntity extends MyBaseEntity implements IUserEntity {
  @Column({
    type: UserConstraints.DB_CONSTRAINTS.TYPE_VARCHAR,
    length: UserEmailVO.constraints.maxLen,
    transformer: new EmailVOTransformer(),
  })
  email: UserEmailVO;

  @Column({
    type: UserConstraints.DB_CONSTRAINTS.TYPE_VARCHAR,
    length: UserNameVO.constraints.maxLen,
    transformer: new NameVOTransformer(),
  })
  name: UserNameVO;

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

  constructor(param?: IUserEntity) {
    super(param);
    if (param) {
      const { email, name, password, role } = param;
      this.email = email;
      this.name = name;
      this.password = password;
      this.role = role ?? 'buyer';
    }
  }

  static from(param: IUserEntity) {
    const newUser = new UserEntity(param);

    return newUser;
  }
}
