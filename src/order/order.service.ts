import { Global, Injectable } from '@nestjs/common';
import { OrderCommand } from './command/order.command';
import { OrderRequestService } from './orderRequest.service';
import { ProductPriceService } from '../product/productPrice.service';
import { OrderPolicyService } from './policy/order.policy';
import { OrderRepository } from './order.repository';
import { ProductService } from '../product/product.service';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRequestService: OrderRequestService,
    private readonly orderRepository: OrderRepository,
    private readonly productPriceService: ProductPriceService,
    private readonly orderPolicyService: OrderPolicyService,
    private readonly productService: ProductService,
  ) {}

  @Transactional()
  async makeOrder(orderCommand: OrderCommand) {
    const { orderRequestId, orderDto, userId } = orderCommand;
    const orderRequest = await this.orderRequestService.find(orderRequestId);

    this.orderRequestService.validateOrderRequestStatus(orderRequest, orderDto);

    //
    // 1. 클라이언트 측 데이터 검증: orderItem 각 아이템당 unitPrice * quantity = subtotal임을 검증
    // 2. 서버 측 데이터 검증: 클라이언트에서 넘어온 상품이 실제로 있는지, 있다면 클라이언트에서 넘어온 가격과 디비에 저장된 현재 가격이 일치하는지 검증
    // 3. product 배열의 subtotal의 합이 order의 subtotal인지 검증
    await this.productPriceService.validateOrderProductsPrice(orderDto);

    // 4. client 배송비와 서버 측에서 저장하고 있는 배송비를 비교
    this.orderPolicyService.validateOrder(orderDto);

    /**
     * 1. product의 재고를 검사
     * 2. 재고가 충분하면 재고 감소, 재고가 충분하지 않으면 에러
     * 3. 재고가 불충분하면 롤백 및 주문 전체 취소
     */
    await this.productService.validateAndDecreaseStocks(orderDto.orderItems);

    /**
     * TODO
     * create Order,OrderItems
     */
    const result = (await this.orderRepository.saveOrder()) as any; // response
    await this.orderRequestService.save({
      id: orderRequestId,
      orderDto,
      responseBody: result,
      userId,
    });
  }
}
