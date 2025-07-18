import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { OrderEntity } from '../../order/entity/order.entity';
import { ProductEntity } from '../../product/entity/product.entity';

export interface IOrderDetail extends IBaseEntity {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number; // quantity * unitPrice
}

@Entity({ name: 'order_details' })
export class OrderDetailEntity extends MyBaseEntity implements IOrderDetail {
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
  })
  orderId: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  @JoinColumn({
    name: 'orderId',
    referencedColumnName: CommonConstraints.DB_CONSTRAINTS.ID,
  })
  order: Relation<OrderEntity>;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
  })
  productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.orderDetails)
  @JoinColumn({
    name: 'productId',
    referencedColumnName: CommonConstraints.DB_CONSTRAINTS.ID,
  })
  product: Relation<ProductEntity>;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    unsigned: true,
  })
  quantity: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    unsigned: true,
  })
  subtotal: number;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER,
    unsigned: true,
  })
  unitPrice: number;

  constructor(param?: IOrderDetail) {
    super(param);
    if (param) {
      const { orderId, productId, quantity, subtotal, unitPrice } = param;
      this.orderId = orderId;
      this.productId = productId;
      this.quantity = quantity;
      this.subtotal = subtotal;
      this.unitPrice = unitPrice;
    }
  }

  static from(param: IOrderDetail) {
    return new OrderDetailEntity(param);
  }
}
