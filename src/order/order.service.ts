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
    const orderRequest = await this.orderRequestService.find(orderRequestId);

    this.orderRequestService.validateOrderRequestStatus(orderRequest, orderDto);

    /**
     * 1. product의 각 아이템당 unitPrice * quantity = subtotal임을 검증
     * 2. product 배열의 subtotal의 합이 order의 subtotal인지 검증
     * 3. order의 subtotal + shippingfee = totalAmount 비교
     * 4. product의 재고 validation
     * 5. product의 재고 감소 및 주문 생성
     *
     *
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
