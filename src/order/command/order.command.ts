import { OrderDto } from '../dto/order.dto';

type OrderInput = {
  orderReqestId: string;
  orderDto: OrderDto;
  userId: number;
};

export class OrderCommand {
  readonly orderRequestId: string;
  private readonly _orderDto: OrderDto;
  readonly userId: number;

  constructor(param: OrderInput) {
    this.orderRequestId = param.orderReqestId;
    this._orderDto = param.orderDto;
    this.userId = param.userId;
  }

  get orderDto() {
    return { ...this._orderDto };
  }
}
