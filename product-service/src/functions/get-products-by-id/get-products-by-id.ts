import { ErrorMessages, Product, SourceProvider } from '../../model';
import jsonProducts from '../../model/products.json';

const defaultProvider: SourceProvider<Product[]> = {
  provide: () => jsonProducts as Product[],
};

export const getProductsById: (
  id: string | null | undefined,
  sourceProvider?: SourceProvider<Product[]>,
) => Product[] = (id, sourceProvider = defaultProvider) => {
  if (id === null || id === undefined || typeof id !== 'string' || id === '') {
    throw new Error(ErrorMessages.BadIdValue);
  }

  const productList = sourceProvider.provide();

  if (productList === null) throw new Error(ErrorMessages.SomethingBadHappened);
  if (productList === undefined)
    throw new Error(ErrorMessages.SomethingBadHappened);
  if (!Array.isArray(productList)) throw new Error(ErrorMessages.BadFormat);

  const result: Product[] = productList.filter((product) => product.id === id);

  if (result.length === 0) {
    throw new Error(ErrorMessages.NotFound);
  }

  return result;
};
