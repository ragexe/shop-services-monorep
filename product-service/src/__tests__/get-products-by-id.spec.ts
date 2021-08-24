import { getProductsById } from '../functions/get-products-by-id/get-products-by-id';
import { ErrorMessages, Product, SourceProvider } from './../model';
import productsMocks from './mock-products.json';

describe('Lambda core getProductsById function', () => {
  test('it should return all products with requested {id}', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return productsMocks as Product[];
      },
    };

    const expectedSlug: string[] = ['diving-yacht-60221'];

    expect(
      getProductsById(
        'a26fe798-c31b-430f-8761-cf0710c67635',
        sourceProvider,
      ).map((product) => product.slug),
    ).toEqual(expectedSlug);
  });

  test('it should throw error inb case of empty data', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return null;
      },
    };

    expect(() =>
      getProductsById('a26fe798-c31b-430f-8761-cf0710c67635', sourceProvider),
    ).toThrowError(Error(ErrorMessages.SomethingBadHappened));
  });

  test('it should throw error in case of wrong data format', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return JSON.parse(`{}`);
      },
    };

    expect(() =>
      getProductsById('a26fe798-c31b-430f-8761-cf0710c67635', sourceProvider),
    ).toThrowError(Error(ErrorMessages.BadFormat));
  });

  test('it should throw a not-found-error if the specified object does not exist', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return productsMocks as Product[];
      },
    };

    expect(() =>
      getProductsById('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', sourceProvider),
    ).toThrowError(Error(ErrorMessages.NotFound));
  });
  test('it should throw an error in case of invalid {id} param', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return productsMocks as Product[];
      },
    };

    expect(() => getProductsById('', sourceProvider)).toThrowError(
      Error(ErrorMessages.BadIdValue),
    );
  });
});
