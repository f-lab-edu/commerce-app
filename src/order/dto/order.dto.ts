import {
  IsArray,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { IBaseEntity } from '../../common/entity/base';
import { IOrderDetail } from '../../orderDetail/entity/orderDetail.entity';
import { UserNameVO } from '../../user/vo/name.vo';
import { AddressVO } from '../vo/address.vo';
import { PostalCodeVO } from '../vo/postalCode.vo';
import { IsValidTotalAmount } from '../utils/isValidTotalAmount.decorator';
import { Type } from 'class-transformer';
import { IOrderEntity } from '../entity/order.entity';

type WithoutBaseEntity<T> = Omit<T, keyof IBaseEntity>;

type IOrderInput = Omit<
  WithoutBaseEntity<IOrderEntity>,
  'userId' | 'orderStatus'
>;
type IOrderItemsInput = Omit<WithoutBaseEntity<IOrderDetail>, 'orderId'>;

export class OrderDto implements IOrderInput {
  @IsInt()
  @Min(0)
  subtotal: number;

  @IsInt()
  @Min(0)
  shippingFee: number;

  @IsInt()
  @Min(0)
  @IsValidTotalAmount()
  totalAmount: number;

  @IsString()
  @Length(UserNameVO.constraints.minLen, UserNameVO.constraints.maxLen)
  recipientName: string;

  @IsPhoneNumber('KR')
  recipientPhone: string;

  @IsString()
  @Length(AddressVO.constraints.minLen, AddressVO.constraints.maxLen)
  shippingAddress: string;

  @IsOptional()
  @IsString()
  @Length(AddressVO.constraints.minLen, AddressVO.constraints.maxLen)
  shippingDetailAddress?: string | undefined;

  @IsString()
  @Length(PostalCodeVO.constraints.minLen, PostalCodeVO.constraints.maxLen)
  postalCode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsInput)
  orderItems: OrderItemsInput[];
}

export class OrderItemsInput implements IOrderItemsInput {
  @IsInt()
  @Min(0)
  productId: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsInt()
  @Min(0)
  subtotal: number;

  @IsInt()
  @Min(0)
  unitPrice: number;
}
