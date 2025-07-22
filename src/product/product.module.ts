import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductsController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDataAccess } from './product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [ProductService, ProductDataAccess],
})
export class ProductModule {}
