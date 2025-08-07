import { Body, Controller, Get, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { NonEmptyValidationPipe } from '../common/pipe/empty.pipe';
import { CustomHeader } from '../common/decorator/customHeader.decorator';
import { OrderCommand } from './command/order.command';
import { JwtPipe } from '../common/pipe/jwt.pipe';
import { JwtPayload } from '../auth/service/auth/auth.applicationServiceImpl';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async makeOrder(
    @CustomHeader('idempotency-key', NonEmptyValidationPipe, ParseUUIDPipe)
    orderReqestId: string,
    // @CustomHeader('authorization', NonEmptyValidationPipe, JwtPipe)
    // jwtPayload: JwtPayload,
    @Body()
    orderDto: OrderDto,
  ) {
    return await this.orderService.makeOrder(
      new OrderCommand({
        orderReqestId,
        orderDto,
        userId: 15092785,
      }),
    );
  }
}
