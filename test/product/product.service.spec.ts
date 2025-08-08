import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../../src/product/product.repository';
import { ProductService } from '../../src/product/product.service';
import { OrderItemsInput } from '../../src/order/dto/order.dto';
import { PersistedProductEntity } from '../../src/product/entity/product.entity';
import { ProductStockException } from '../../src/common/exception/product.exception';

describe('Product Service Test Suites', () => {
  let sut: ProductService;
  let productRepositoryMock: jest.Mocked<ProductRepository>;
  const fakeProduct: PersistedProductEntity = {
    id: 1,
    name: `fake-name-1`,
    price: 100,
    stocks: 100,
    createdAt: new Date('2025-08-08'),
    updatedAt: new Date('2025-08-08'),
  };
  const fakeOrderItems: OrderItemsInput[] = [
    {
      productId: 1,
      quantity: 1,
      subtotal: 100,
      unitPrice: 100,
    },
    {
      productId: 2,
      quantity: 1,
      subtotal: 10,
      unitPrice: 10,
    },
  ];

  const fakeProducts: PersistedProductEntity[] = [
    {
      ...fakeProduct,
      id: 1,
      price: 100,
    },
    {
      ...fakeProduct,
      id: 2,
      price: 10,
    },
  ];

  beforeEach(async () => {
    const productRepositoryMockValues: Partial<ProductRepository> = {
      findMany: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: productRepositoryMockValues,
        },
      ],
    }).compile();

    sut = module.get(ProductService);
    productRepositoryMock = module.get(ProductRepository);
  });

  it('테스트 클래스들이 정의되어야합니다.', () => {
    expect(sut).toBeDefined();
    expect(productRepositoryMock).toBeDefined();
  });

  it('재고가 충분하면 재고를 감소시키고 상품 데이터를 리턴한다.', async () => {
    const orderItemMap = fakeOrderItems.reduce((prev, cur) => {
      prev[cur.productId] = cur;
      return prev;
    }, {});
    const expected = fakeProducts.map((p) => ({
      ...p,
      stocks: p.stocks - orderItemMap[p.id],
    }));
    productRepositoryMock.findMany.mockResolvedValue(fakeProducts);
    productRepositoryMock.save.mockResolvedValue(expected);

    const result = await sut.validateAndDecreaseStocks(fakeOrderItems);

    expect(result).toEqual(expected);
  });

  it('재고가 맞지 않으면 에러를 던진다.', async () => {
    const overOrderedQty = fakeProduct.stocks * 10;
    const overOrderedItems = fakeOrderItems.map((oi) => ({
      ...oi,
      quantity: overOrderedQty,
    }));
    productRepositoryMock.findMany.mockResolvedValue(fakeProducts);

    await expect(() =>
      sut.validateAndDecreaseStocks(overOrderedItems),
    ).rejects.toThrow(ProductStockException);
  });
});
