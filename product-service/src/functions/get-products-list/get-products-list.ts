import { Product, SourceProvider } from '../../model';
import jsonProducts from '../../model/products.json';

const defaultProvider: SourceProvider<Product[]> = {
  provide: () => jsonProducts as Product[],
};

export const getProductsList: (
  provider?: SourceProvider<Product[]>,
) => Product[] = (provider = defaultProvider) => {
  const resultProducts = provider.provide();

  if (resultProducts === null) throw new Error('Something bad happened!');
  if (resultProducts === undefined) throw new Error('Something bad happened!');
  if (!Array.isArray(resultProducts)) throw new Error('Bad format!');

  return resultProducts;
};
