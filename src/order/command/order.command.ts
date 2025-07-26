import { OrderDto } from '../dto/order.dto';

type OrderInput = {
  key: string;
  orderDto: OrderDto;
  userId: number;
};

export class OrderCommand {
  private _idempotencyKey: string;
  private _orderDto: OrderDto;
  private _userId: number;

  constructor(param: OrderInput) {
    this._idempotencyKey = param.key;
    this._orderDto = param.orderDto;
    this._userId = param.userId;
  }

  get userId() {
    return this._userId;
  }

  get idempotencyKey() {
    return this._idempotencyKey;
  }

  get orderDto() {
    return this._orderDto;
  }
}
