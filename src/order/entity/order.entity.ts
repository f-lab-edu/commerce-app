import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderDetailEntity } from '../../orderDetail/entity/orderDetail.entity';

/**
 * 주문 상태 흐름 다이어그램
 * - pending: 주문 접수 (결제 대기)
 * - paid: 결제 완료
 * - processing: 상품 준비 중
 * - shipped: 배송 중
 * - delivered: 배송완료
 * - canceled: 주문 취소
 * - refunded: 환불 완료
 *
 *  흐름도
 *
 *   시작
 *    │
 *  pending
 *    │
 *   paid ──────+
 *    │         |
 *  shipped ────+ canceled -> refuended
 *    │         |
 * delivered ───+
 *    |
 *   종료
 */

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
};
const OrderStatusEnum = Object.values(ORDER_STATUS);
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
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
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
      Object.assign(this, param);
    }
  }

  static from(param: IOrderEntity) {
    return new OrderEntity(param);
  }
}
