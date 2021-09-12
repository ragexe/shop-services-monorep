import { ErrorMessages, Product, DataProvider } from './../../model';
import { DEFAULT_PRODUCT_PROVIDER } from './../functions-helper';


export const getProductsList: (
  dataProvider?: DataProvider<Product[]>,
) => Promise<Product[]> = async (dataProvider = DEFAULT_PRODUCT_PROVIDER) => {
  let resultProducts: Product[] | null | undefined;

  try {
    resultProducts = await dataProvider.retrieve();
  } catch (error) {
    throw new Error(ErrorMessages.InternalDBError);
  }

  if (resultProducts === null || resultProducts === undefined) {
    throw new Error(ErrorMessages.SomethingBadHappened);
  }

  if (!Array.isArray(resultProducts)) {
    throw new Error(ErrorMessages.BadFormat);
  }

  return resultProducts;
};
