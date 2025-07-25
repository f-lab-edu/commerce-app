import { OrderDto } from '../dto/order.dto';

type OrderInput = {
  key: string;
  orderDto: OrderDto;
};

export class OrderCommand {
  private _idempotencyKey: string;
  private _orderDto: OrderDto;

  constructor(param: OrderInput) {
    this._idempotencyKey = param.key;
    this._orderDto = param.orderDto;
  }

  get idempotencyKey() {
    return this._idempotencyKey;
  }

  get orderDto() {
    return this._orderDto;
  }
}
