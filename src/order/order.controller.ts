import { Body, Controller, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { CheckIfEmptyPipe } from '../common/pipe/empty.pipe';
import { CustomHeader } from '../common/decorator/customHeader.decorator';
import { OrderCommand } from './command/order.command';
import { JwtPipe } from '../common/pipe/jwt.pipe';
import { JwtPayload } from '../auth/service/auth/auth.applicationServiceImpl';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async makeOrder(
    @CustomHeader('idempotency-key', CheckIfEmptyPipe, ParseUUIDPipe)
    idempotencyKey: string,
    @CustomHeader('authorization', CheckIfEmptyPipe, JwtPipe)
    jwtPayload: JwtPayload,
    @Body()
    orderDto: OrderDto,
  ) {
    return await this.orderService.makeOrder(
      new OrderCommand({
        key: idempotencyKey,
        orderDto,
        userId: jwtPayload.id,
      }),
    );
  }
}
