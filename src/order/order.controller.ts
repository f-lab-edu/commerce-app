import { Body, Controller, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor() {}

  @Post()
  async makeOrder(@Body() orderDto: OrderDto) {}
}
