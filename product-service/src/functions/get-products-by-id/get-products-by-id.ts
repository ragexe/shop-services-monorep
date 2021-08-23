import { Product } from '../../model';
import products from '../../model/products.json';

const productList = [...(products as Product[])];

export const getProductsById: (id: string) => Product[] = (id) => {
  if (!Boolean(id)) return [];

  return productList.filter(
    (product) => product.id === id,
  );
};
