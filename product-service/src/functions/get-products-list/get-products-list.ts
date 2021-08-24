import { ErrorMessages, Product, SourceProvider } from '../../model';
import jsonProducts from '../../model/products.json';

const defaultProvider: SourceProvider<Product[]> = {
  provide: () => jsonProducts as Product[],
};

export const getProductsList: (
  provider?: SourceProvider<Product[]>,
) => Product[] = (provider = defaultProvider) => {
  const resultProducts = provider.provide();

  if (resultProducts === null)
    throw new Error(ErrorMessages.SomethingBadHappened);
  if (resultProducts === undefined)
    throw new Error(ErrorMessages.SomethingBadHappened);
  if (!Array.isArray(resultProducts)) throw new Error(ErrorMessages.BadFormat);

  return resultProducts;
};
