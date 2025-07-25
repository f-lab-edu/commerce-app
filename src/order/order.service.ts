import { Injectable } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { OrderCommand } from './command/order.command';
import {
  IDEMPOTENCY_STATUS,
  IdempotencyKeyEntity,
} from './entity/idempotency.entity';
import { OrderDataAccess } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly orderDataAccess: OrderDataAccess,
  ) {}

  async makeOrder(orderCommand: OrderCommand) {
    const { idempotencyKey, orderDto } = orderCommand;
    const idempotencyKeyEntity =
      await this.idempotencyService.find(idempotencyKey);

    this.idempotencyService.checkIfCanMakeOrder(idempotencyKeyEntity, orderDto);

    /**
     * 주문 로직 실행.
     * 멱등성 로직을 우선 구현
     * saveOrder는 미구현 상태
     */
    const result = await this.orderDataAccess.saveOrder();
  }
}
