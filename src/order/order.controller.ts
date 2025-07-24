import { Body, Controller, Headers, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor() {}

  @Post()
  async makeOrder(
    @Headers('Idempotency-Key') idempotencyKey: string | undefined,
    @Body()
    orderDto: OrderDto,
  ) {}
}
