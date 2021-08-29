import { ErrorMessages, Product, SourceProvider } from '../../model';
import jsonProducts from '../../model/products.json';

const defaultProvider: SourceProvider<Product[]> = {
  provide: () => Promise.resolve(jsonProducts as Product[]),
};

export const getProductsList: (
  provider?: SourceProvider<Product[]>,
) => Promise<Product[]> = async (provider = defaultProvider) => {
  const resultProducts = await provider.provide();

  if (resultProducts === null || resultProducts === undefined) {
    throw new Error(ErrorMessages.SomethingBadHappened);
  }

  if (!Array.isArray(resultProducts)) {
    throw new Error(ErrorMessages.BadFormat);
  }

  return resultProducts;
};
