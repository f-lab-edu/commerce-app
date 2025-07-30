import { OrderDto } from '../dto/order.dto';

type OrderInput = {
  key: string;
  orderDto: OrderDto;
  userId: number;
};

export class OrderCommand {
  readonly idempotencyKey: string;
  private readonly _orderDto: OrderDto;
  readonly userId: number;

  constructor(param: OrderInput) {
    this.idempotencyKey = param.key;
    this._orderDto = param.orderDto;
    this.userId = param.userId;
  }

  get orderDto() {
    return { ...this._orderDto };
  }
}
