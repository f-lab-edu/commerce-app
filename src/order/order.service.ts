import { Injectable } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { OrderCommand } from './command/order.command';
import { OrderDataAccess } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly orderDataAccess: OrderDataAccess,
  ) {}

  async makeOrder(orderCommand: OrderCommand) {
    const { idempotencyKey, orderDto, userId } = orderCommand;
    const idempotencyKeyEntity =
      await this.idempotencyService.find(idempotencyKey);

    this.idempotencyService.checkIfCanMakeOrder(idempotencyKeyEntity, orderDto);

    /**
     * 주문 로직 실행.
     * 멱등성 로직을 우선 구현
     * 주문을 생성하는 로직은 아직 미구현
     */
    const result = (await this.orderDataAccess.saveOrder()) as any; // response
    await this.idempotencyService.save({
      key: idempotencyKey,
      orderDto,
      response: result,
      userId,
    });
  }
}
