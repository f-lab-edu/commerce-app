import { Injectable } from '@nestjs/common';
import { OrderCommand } from './command/order.command';
import { OrderDataAccess } from './order.repository';
import { OrderRequestService } from './orderRequest.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRequestService: OrderRequestService,
    private readonly orderDataAccess: OrderDataAccess,
  ) {}

  async makeOrder(orderCommand: OrderCommand) {
    const { orderRequestId, orderDto, userId } = orderCommand;
    const idempotencyKeyEntity =
      await this.orderRequestService.find(orderRequestId);

    this.orderRequestService.checkIfCanMakeOrder(
      idempotencyKeyEntity,
      orderDto,
    );

    /**
     * 주문 로직 실행.
     * 멱등성 로직을 우선 구현
     * 주문을 생성하는 로직은 아직 미구현
     */
    const result = (await this.orderDataAccess.saveOrder()) as any; // response
    await this.orderRequestService.save({
      id: orderRequestId,
      orderDto,
      responseBody: result,
      userId,
    });
  }
}
