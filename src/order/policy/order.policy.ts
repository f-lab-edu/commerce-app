import { Injectable } from '@nestjs/common';
import { OrderDto } from '../dto/order.dto';
import { ClientOrderInfoException } from '../../common/exception/product.exception';

@Injectable()
export class OrderPolicyService {
  // DB에서 관리하는게 맞으나 프로젝트 진행을 위해서 배송비는 클래스 변수로 선언했습니다.
  // 배송비는 3000원입니다.
  private SHIPPING_FEE = 3000;

  validateOrder(orderDto: OrderDto) {
    if (orderDto.shippingFee !== this.SHIPPING_FEE) {
      throw new ClientOrderInfoException();
    }
  }
}
