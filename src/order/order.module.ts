import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtPipe } from '../common/pipe/jwt.pipe';
import { OrderRequestEntity } from './entity/orderRequest.entity';
import { OrderRequestService } from './orderRequest.service';
import { OrderDataAccess } from './order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderRequestEntity])],
  providers: [OrderService, OrderRequestService, JwtPipe, OrderDataAccess],
  controllers: [OrderController],
})
export class OrderModule {}
