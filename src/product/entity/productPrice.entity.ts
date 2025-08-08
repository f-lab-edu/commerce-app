import { Column, Entity } from 'typeorm';
import { MyBaseEntity } from '../../common/entity/base';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { z } from 'zod';

const BaseSchema = z.object({
  id: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const ProductPriceSchema = z.object({
  productId: z.number(),
  price: z.number(),
  effectiveDate: z.date(),
  isCurrent: z.boolean(),
});

type BaseType = z.infer<typeof BaseSchema>;
type ProductPriceType = z.infer<typeof ProductPriceSchema>;
type IProductPriceEntity = BaseType & ProductPriceType;
export type PersistedProductPriceEntity = Required<IProductPriceEntity>;

@Entity({ name: 'product_prices' })
export class ProductPriceEntity
  extends MyBaseEntity
  implements IProductPriceEntity
{
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
  })
  productId: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    default: 0,
  })
  price: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_DATE,
  })
  effectiveDate: Date;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_BOOLEAN,
    default: true,
  })
  isCurrent: boolean;

  private constructor(param?: BaseType) {
    super(param);
  }

  static create(param: IProductPriceEntity) {
    const safeParsedParam = ProductPriceSchema.parse(param);
    const entity = new ProductPriceEntity(param);
    Object.assign(entity, safeParsedParam);
    return entity;
  }
}
