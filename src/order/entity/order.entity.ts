import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderDetailEntity } from '../../orderDetail/entity/orderDetail.entity';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHAPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
};
const extractOrderStatusEnum = () => Object.values(ORDER_STATUS);
const OrderStatusEnum = extractOrderStatusEnum();
type OrderStatus = typeof ORDER_STATUS;
type TOrderStatus = OrderStatus[keyof OrderStatus];

export interface IOrderEntity extends IBaseEntity {
  userId: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number; // (상품 합계 금액 + 배송비)
  orderStatus: TOrderStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingDetailAddress?: string;
  postalCode: string;
}

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
  user: UserEntity;

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
    enum: OrderStatusEnum,
    default: ORDER_STATUS.PENDING,
  })
  orderStatus: string;

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
  orderDetails: OrderDetailEntity[];

  constructor(param?: IOrderEntity) {
    super(param);
    if (param) {
      const {
        orderStatus,
        postalCode,
        recipientName,
        recipientPhone,
        shippingAddress,
        shippingFee,
        subtotal,
        totalAmount,
        userId,
        shippingDetailAddress,
      } = param;

      this.orderStatus = orderStatus;
      this.postalCode = postalCode;
      this.recipientName = recipientName;
      this.recipientPhone = recipientPhone;
      this.shippingAddress = shippingAddress;
      this.shippingFee = shippingFee;
      this.subtotal = subtotal;
      this.totalAmount = totalAmount;
      this.userId = userId;
      this.shippingDetailAddress = shippingDetailAddress;
    }
  }

  static from(param: IOrderEntity) {
    return new OrderEntity(param);
  }
}
