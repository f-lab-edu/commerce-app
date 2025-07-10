import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailEntity } from './entity/orderDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetailEntity])],
})
export class OrderDetailModule {}
