import { registerDecorator, ValidationOptions } from 'class-validator';
import { OrderDto } from '../dto/order.dto';

export function IsValidTotalAmount(
  property?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: '최종 금액이 일치하지 않습니다. 다시 시도하여 주세요.',
        ...validationOptions,
      },
      validator: {
        validate(value: number, validationArguments) {
          if (!validationArguments?.object) {
            return false;
          }
          const { object } = validationArguments;
          return isOrderDto(object) && isValidTotalAmount(object);
        },
      },
    });
  };
}

const isValidTotalAmount = (orderDto: OrderDto) =>
  orderDto.totalAmount === orderDto.shippingFee + orderDto.subtotal;

const isOrderDto = (obj: unknown): obj is OrderDto => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'shippingFee' in obj &&
    'subtotal' in obj &&
    'totalAmount' in obj
  );
};
