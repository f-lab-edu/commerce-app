import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderDetailEntity } from '../../orderDetail/entity/orderDetail.entity';
import z from 'zod';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHAPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
};
const OrderStatusValues = Object.values(ORDER_STATUS);

const OrderSchema = z.object({
  userId: z.number(),
  subtotal: z.number(),
  shippingFee: z.number(),
  totalAmount: z.number(),
  orderStatus: z.enum(OrderStatusValues),
  recipientName: z.string(),
  recipientPhone: z.string(),
  shippingAddress: z.string(),
  postalCode: z.string(),
  shippingDetailAddress: z.string().optional(),
});
type OrderEntityType = z.infer<typeof OrderSchema>;
export type IOrderEntity = IBaseEntity & OrderEntityType;
export type OrderParam = Omit<IOrderEntity, 'orderStatus'>;
export type PersistedOrderEntity = Required<Omit<OrderEntity, 'orderDetails'>>;

@Entity({ name: 'orders' })
export class OrderEntity extends MyBaseEntity implements IOrderEntity {
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: CommonConstraints.DB_CONSTRAINTS.ID,
  })
  user?: UserEntity;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    unsigned: true,
  })
  subtotal: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    unsigned: true,
  })
  shippingFee: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    unsigned: true,
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatusValues,
    default: ORDER_STATUS.PENDING,
  })
  orderStatus: string = ORDER_STATUS.PENDING;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  recipientName: string;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  recipientPhone: string;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  shippingAddress: string;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    nullable: true,
  })
  shippingDetailAddress?: string | undefined;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  postalCode: string;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails?: OrderDetailEntity[];

  private constructor(param?: IBaseEntity) {
    super(param);
  }

  static create(param: OrderParam) {
    const safeParsedParam = OrderSchema.parse(param);
    const entity = new OrderEntity(param);
    Object.assign(entity, safeParsedParam);
    return entity;
  }
}
