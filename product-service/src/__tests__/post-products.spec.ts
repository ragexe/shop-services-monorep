import { ILogger } from './../libs/logger';
import { postProducts } from '../functions/post-products/post-products';
import { DataConsumer, ErrorMessages, Product } from '../model';
import productsMocks from './mock-products.json';

describe('Lambda core postProducts function', () => {
  test('it should use DataConsumer to store item', async () => {
    const dataConsumer: DataConsumer<Product> = {
      store: () => {
        return Promise.resolve();
      },
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

    const result = await postProducts(
      { product: productToStore },
      dataConsumer,
    );
    expect(result).toEqual(void 0);
  });

  test('it should throw error in case of invalid product value', async () => {
    const dataConsumer: DataConsumer<Product> = {
      store: () => {
        return Promise.resolve();
      },
    };

    const product = null;

    try {
      await postProducts(product, dataConsumer);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.ProductDataIsInvalid);
    }
  });

  test('it should throw error in case of providing product ID', async () => {
    const dataConsumer: DataConsumer<Product> = {
      store: () => {
        return Promise.resolve();
      },
    };

    const logger: ILogger = {
      trace: () => {},
      error: () => {},
    };

    const product = productsMocks[2] as Product;

    try {
      await postProducts({ product }, dataConsumer, logger);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.ProductDataIsInvalid);
    }
  });

  test('it should throw error in case of providing invalid product value', async () => {
    const dataConsumer: DataConsumer<Product> = {
      store: () => {
        return Promise.resolve();
      },
    };

    const logger: ILogger = {
      trace: () => {},
      error: () => {},
    };

    const { __typename, productCode, name, slug, primaryImage } =
      productsMocks[2];

    const productToStore = {
      __typename,
      productCode,
      name,
      slug,
      primaryImage,
    } as Product;

    try {
      await postProducts({ product: productToStore }, dataConsumer, logger);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.ProductDataIsInvalid);
    }
  });
});
