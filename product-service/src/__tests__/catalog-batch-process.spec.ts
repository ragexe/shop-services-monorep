import {
  storeProducts,
  TResult,
} from '../functions/catalog-batch-process/catalog-batch-process';
import { ILogger } from '../libs/logger';
import {
  AttributesTypename,
  AvailabilityStatus,
  AvailabilityText,
  CurrencyCode,
  DataConsumer,
  ListPriceTypename,
  Product,
  ProductTypename,
  VariantTypename,
} from '../model';
import productsMocks from './mock-products.json';

describe('Lambda core storeProducts function', () => {
  test('it should use DataConsumer to store item in DB', async () => {
    const dataConsumerMock: DataConsumer<Product> = {
      store: () => {
        return Promise.resolve();
      },
    };

    const loggerMock: ILogger = {
      trace: () => {},
      log: () => {},
      error: () => {},
    };

    const expected: TResult = {
      invalid: [],
      stored: [
        {
          __typename: ProductTypename.SingleVariantProduct,
          baseImgUrl:
            'https://www.lego.com/cdn/cs/set/assets/blt285ddcfce73f8442/60254.jpg',
          name: 'Race Boat Transporter',
          overrideUrl: null,
          primaryImage:
            'https://www.lego.com/cdn/cs/set/assets/blt285ddcfce73f8442/60254.jpg?fit=bounds&format=jpg&quality=80&width=640&height=640&dpr=1',
          productCode: '60254',
          slug: 'race-boat-transporter-60254',
          variant: {
            __typename: VariantTypename.ProductVariant,
            attributes: {
              __typename: AttributesTypename.ProductAttributes,
              availabilityStatus: AvailabilityStatus.EAvailable,
              availabilityText: AvailabilityText.AvailableNow,
              canAddToBag: true,
              canAddToWishlist: true,
              featuredFlags: [],
              isNew: null,
              maxOrderQuantity: 3,
              onSale: false,
              rating: 5,
              vipAvailabilityStatus: null,
              vipAvailabilityText: null,
              vipCanAddToBag: null,
            },
            id: '6288841',
            listPrice: {
              __typename: ListPriceTypename.Price,
              centAmount: 2999,
              formattedAmount: '$29.99',
            },
            price: {
              __typename: ListPriceTypename.Price,
              centAmount: 2999,
              currencyCode: CurrencyCode.Usd,
              formattedAmount: '$29.99',
              formattedValue: 29.99,
            },
            salePercentage: 0,
            sku: '6288841',
          },
        },
      ],
      unstored: [],
    };

    const {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
      baseImgUrl,
      overrideUrl,
      variant,
    } = productsMocks[2];

    const productToStore = {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
      baseImgUrl,
      overrideUrl,
      variant,
    } as Product;

    const result = await storeProducts(
      { ...productToStore },
      dataConsumerMock,
      loggerMock,
    );
    expect(result).toEqual(expected);
  });

  test('it should validate data before storing item to DB', async () => {
    const dataConsumerMock: DataConsumer<Product> = {
      store: () => {
        return Promise.resolve();
      },
    };

    const loggerMock: ILogger = {
      trace: () => {},
      log: () => {},
      error: () => {},
    };

    const expected: TResult['invalid'][number]['product'] = {
      __typename: 'INVALID TYPE NAME',
    };

    const {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
      baseImgUrl,
      overrideUrl,
      variant,
    } = { ...productsMocks[2], __typename: 'INVALID TYPE NAME' };

    const productToStore = {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
      baseImgUrl,
      overrideUrl,
      variant,
    } as Product;

    const result = await storeProducts(
      { ...productToStore },
      dataConsumerMock,
      loggerMock,
    );
    expect({
      __typename: (result.invalid[0].product as any).__typename,
    }).toEqual(expected);
  });

  test('it should collect unstored objects', async () => {
    const dataConsumerMock: DataConsumer<Product> = {
      store: () => {
        return Promise.reject('You shall not pass!!!');
      },
    };

    const loggerMock: ILogger = {
      trace: () => {},
      log: () => {},
      error: () => {},
    };

    const expected: TResult = {
      invalid: [],
      stored: [],
      unstored: [
        {
          product: {
            __typename: ProductTypename.SingleVariantProduct,
            baseImgUrl:
              'https://www.lego.com/cdn/cs/set/assets/blt285ddcfce73f8442/60254.jpg',
            name: 'Race Boat Transporter',
            overrideUrl: null,
            primaryImage:
              'https://www.lego.com/cdn/cs/set/assets/blt285ddcfce73f8442/60254.jpg?fit=bounds&format=jpg&quality=80&width=640&height=640&dpr=1',
            productCode: '60254',
            slug: 'race-boat-transporter-60254',
            variant: {
              __typename: VariantTypename.ProductVariant,
              attributes: {
                __typename: AttributesTypename.ProductAttributes,
                availabilityStatus: AvailabilityStatus.EAvailable,
                availabilityText: AvailabilityText.AvailableNow,
                canAddToBag: true,
                canAddToWishlist: true,
                featuredFlags: [],
                isNew: null,
                maxOrderQuantity: 3,
                onSale: false,
                rating: 5,
                vipAvailabilityStatus: null,
                vipAvailabilityText: null,
                vipCanAddToBag: null,
              },
              id: '6288841',
              listPrice: {
                __typename: ListPriceTypename.Price,
                centAmount: 2999,
                formattedAmount: '$29.99',
              },
              price: {
                __typename: ListPriceTypename.Price,
                centAmount: 2999,
                currencyCode: CurrencyCode.Usd,
                formattedAmount: '$29.99',
                formattedValue: 29.99,
              },
              salePercentage: 0,
              sku: '6288841',
            },
          },
          error: 'You shall not pass!!!',
        },
      ],
    };

    const {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
      baseImgUrl,
      overrideUrl,
      variant,
    } = productsMocks[2];

    const productToStore = {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
      baseImgUrl,
      overrideUrl,
      variant,
    } as Product;

    const result = await storeProducts(
      { ...productToStore },
      dataConsumerMock,
      loggerMock,
    );
    expect(result).toEqual(expected);
  });
});
