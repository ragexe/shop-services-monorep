import { getProductsById } from '../functions/get-products-by-id/get-products-by-id';
import { ErrorMessages, Product, DataProvider } from './../model';
import productsMocks from './mock-products.json';

describe('Lambda core getProductsById function', () => {
  test('it should return all products with requested {id}', async () => {
    const sourceProvider: DataProvider<Product[]> = {
      retrieve: () => {
        return Promise.resolve(productsMocks as Product[]);
      },
    };

    const expectedSlug: string[] = ['diving-yacht-60221'];
    const products = await getProductsById(
      'a26fe798-c31b-430f-8761-cf0710c67635',
      sourceProvider,
    );
    const resultSlug = products.map((product) => product.slug);

    expect(resultSlug).toEqual(expectedSlug);
  });

  test('it should throw error inb case of empty data', async () => {
    const sourceProvider: DataProvider<Product[]> = {
      retrieve: () => {
        return Promise.resolve(null);
      },
    };

    try {
      await getProductsById(
        'a26fe798-c31b-430f-8761-cf0710c67635',
        sourceProvider,
      );
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.SomethingBadHappened);
    }
  });

  test('it should throw error in case of wrong data format', async () => {
    const sourceProvider: DataProvider<Product[]> = {
      retrieve: () => {
        return JSON.parse(`{}`);
      },
    };

    try {
      await getProductsById(
        'a26fe798-c31b-430f-8761-cf0710c67635',
        sourceProvider,
      );
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.BadFormat);
    }
  });

  test('it should throw a not-found-error if the specified object does not exist', async () => {
    const sourceProvider: DataProvider<Product[]> = {
      retrieve: () => {
        return Promise.resolve(productsMocks as Product[]);
      },
    };

    try {
      await getProductsById(
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        sourceProvider,
      );
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.NotFound);
    }
  });

  test('it should throw an error in case of invalid {id} param', async () => {
    const sourceProvider: DataProvider<Product[]> = {
      retrieve: () => {
        return Promise.resolve(productsMocks as Product[]);
      },
    };

    try {
      await getProductsById('', sourceProvider);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.BadIdValue);
    }
  });
});
