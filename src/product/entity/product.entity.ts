import { Column, Entity } from 'typeorm';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { CommonConstraints } from '../../common/entity/base.constraints';

export interface IProductEntity extends IBaseEntity {
  name: string;
  description?: string;
  price: number;
  stocks: number;
}

export type PersistedProductEntity = Required<
  Omit<IProductEntity, 'description'>
> &
  Pick<IProductEntity, 'description'>;

@Entity({ name: 'products' })
export class ProductEntity extends MyBaseEntity implements IProductEntity {
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  name: string;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_TEXT,
    nullable: true,
  })
  description?: string;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_UNSIGNED_NUMBER,
    unsigned: true,
  })
  price: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_UNSIGNED_NUMBER,
    unsigned: true,
  })
  stocks: number;

  constructor(param?: IProductEntity) {
    super(param);
    if (param) {
      const { name, price, stocks, description } = param;
      this.name = name;
      this.price = price;
      this.stocks = stocks;
      this.description = description;
    }
  }

  static from(param: IProductEntity) {
    return new ProductEntity(param);
  }
}
