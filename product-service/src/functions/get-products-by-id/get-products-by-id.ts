import { ErrorMessages, Product, DataProvider } from '../../model';
import { DEFAULT_PRODUCT_PROVIDER } from './../functions-helper';

export const getProductsById: (
  id: string | null | undefined,
  dataProvider?: DataProvider<Product[]>,
) => Promise<Product[]> = async (
  id,
  dataProvider = DEFAULT_PRODUCT_PROVIDER,
) => {
  if (id === null || id === undefined || typeof id !== 'string' || id === '') {
    throw new Error(ErrorMessages.BadIdValue);
  }

  let productList;
  try {
    productList = await dataProvider.retrieve(
      `select * from products inner join stocks on stocks.product_id = products.id where products.id = '${id}';`,
    );
  } catch (error) {
    throw new Error(ErrorMessages.InternalDBError);
  }

  if (productList === null || productList === undefined) {
    throw new Error(ErrorMessages.SomethingBadHappened);
  }

  if (!Array.isArray(productList)) {
    throw new Error(ErrorMessages.BadFormat);
  }

  const result: Product[] = productList.filter((product) => product.id === id);

  if (result.length === 0) {
    throw new Error(ErrorMessages.NotFound);
  }

  return result;
};
