import { Injectable } from '@nestjs/common';
import { OrderCommand } from './command/order.command';
import { OrderDataAccess } from './order.repository';
import { OrderRequestService } from './orderRequest.service';
import { ProductPriceService } from '../product/productPrice.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRequestService: OrderRequestService,
    private readonly orderDataAccess: OrderDataAccess,
    private readonly productPriceService: ProductPriceService,
  ) {}

  async makeOrder(orderCommand: OrderCommand) {
    const { orderRequestId, orderDto, userId } = orderCommand;
    const orderRequest = await this.orderRequestService.find(orderRequestId);

    this.orderRequestService.validateOrderRequestStatus(orderRequest, orderDto);

    //
    // 1. 클라이언트 측 데이터 검증: orderItem 각 아이템당 unitPrice * quantity = subtotal임을 검증
    // 2. 서버 측 데이터 검증: 클라이언트에서 넘어온 상품이 실제로 있는지, 있다면 클라이언트에서 넘어온 가격과 디비에 저장된 현재 가격이 일치하는지 검증
    await this.productPriceService.validateOrderProductsPrice(
      orderDto.orderItems,
    );

    /**
     * 2. product 배열의 subtotal의 합이 order의 subtotal인지 검증
     * 3. order의 subtotal + shippingfee = totalAmount 비교
     * 4. product의 재고 validation
     * 5. product의 재고 감소 및 주문 생성
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
