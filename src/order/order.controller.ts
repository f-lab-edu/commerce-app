import { Body, Controller, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { CheckIfEmptyPipe } from '../common/pipe/empty.pipe';
import { CustomHeader } from '../common/decorator/customHeader.decorator';
import { OrderCommand } from './command/order.command';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async makeOrder(
    @CustomHeader('idempotency-key', CheckIfEmptyPipe, ParseUUIDPipe)
    idempotencyKey: string,
    @Body()
    orderDto: OrderDto,
  ) {
    return await this.orderService.makeOrder(
      new OrderCommand({ key: idempotencyKey, orderDto }),
    );
  }
}
