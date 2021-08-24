import { getProductsList } from '../functions/get-products-list/get-products-list';
import { ErrorMessages, Product, SourceProvider } from './../model';
import productsMocks from './mock-products.json';

describe('Lambda core getProductsList function', () => {
  test('it should return all available products', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return productsMocks as Product[];
      },
    };

    const expectedOutputIds: string[] = [
      '5348f50c-a80d-4361-846d-9b5cc35c9dcf',
      'f006e147-ce2a-4d07-ae48-281bfeed9469',
      '9a729126-6668-46a1-b28f-766a5f60bdf2',
      'a6a80317-c51b-4786-afa2-7421f5975a9b',
      'a26fe798-c31b-430f-8761-cf0710c67635',
      '38ef8fae-626f-476f-af03-4679e2e6590e',
      '6ebd1d1f-583f-4ecb-9abb-2e565282b401',
      '0be0453e-5613-4a3d-8239-dae11d50326d',
      '962e14cf-18ca-44f4-a292-1aa7222882a5',
      'c7e85f80-ca96-44d9-bdc0-ecd0b34d7e20',
      '2e99813d-6e14-4d6c-a731-827e22687c48',
    ];

    expect(
      getProductsList(sourceProvider).map((product) => product.id),
    ).toEqual(expectedOutputIds);
  });

  test('it should throw error inb case of empty data', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return null;
      },
    };

    expect(() => getProductsList(sourceProvider)).toThrowError(
      Error(ErrorMessages.SomethingBadHappened),
    );
  });

  test('it should throw error inb case of wrong data format', () => {
    const sourceProvider: SourceProvider<Product[]> = {
      provide: () => {
        return JSON.parse(`{}`);
      },
    };

    expect(() => getProductsList(sourceProvider)).toThrowError(
      Error(ErrorMessages.BadFormat),
    );
  });
});
