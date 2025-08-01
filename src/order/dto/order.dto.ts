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
import { IOrderEntity } from '../entity/order.entity';
import { UserNameVO } from '../../user/vo/name.vo';
import { AddressVO } from '../vo/address.vo';
import { PostalCodeVO } from '../vo/postalCode.vo';

type WithoutBaseEntity<T> = Omit<T, keyof IBaseEntity>;

type IOrderInput = Omit<
  WithoutBaseEntity<IOrderEntity>,
  'userId' | 'orderStatus'
>;
type IOrderDetailInput = Omit<WithoutBaseEntity<IOrderDetail>, 'orderId'>;

export class OrderDto implements IOrderInput {
  @IsInt()
  @Min(0)
  subtotal: number;

  @IsInt()
  @Min(0)
  shippingFee: number;

  @IsInt()
  @Min(0)
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
  @Length(PostalCodeVO.constraints.minLen, PostalCodeVO.constraints.minLen)
  postalCode: string;

  @IsArray()
  @ValidateNested()
  orderItems: OrderDetailInputs[];
}

export class OrderDetailInputs implements IOrderDetailInput {
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
