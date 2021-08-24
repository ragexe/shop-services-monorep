import { Product } from '../../model';
import products from '../../model/products.json';

const productList = [...(products as Product[])];

export const getProductsById: (id: string | null | undefined) => Product[] = (
  id,
) => {
  if (id === null || id === undefined || typeof id !== 'string' || id === '') {
    throw new Error('Bad id value!');
  }

  return productList.filter((product) => product.id === id);
};
