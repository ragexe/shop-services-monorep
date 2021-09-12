import { DefaultLogger } from '../../libs/logger';
import {
  DataProvider,
  ErrorMessages,
  getProductFromDTO,
  Product,
  TProductDTO,
} from '../../model';
import { getDataBaseClient } from './../functions-helper';

const PRODUCT_BY_ID_DATA_PROVIDER: DataProvider<Product[]> | undefined = {
  retrieve: async (query) => {
    if (!query) throw new Error('Empty query exception');

    const databaseClient = getDataBaseClient();
    await databaseClient.connect();

    try {
      const { rows: productDTOs } = await databaseClient.query<TProductDTO>(
        query,
      );

      const products: Product[] = productDTOs.map<Product>((productDTO) =>
        getProductFromDTO(productDTO),
      );

      return products;
    } catch (error) {
      DefaultLogger.error(error);
      throw error;
    } finally {
      databaseClient.end();
    }
  },
};

export const getProductsById: (
  id: string | null | undefined,
  dataProvider?: DataProvider<Product[]>,
) => Promise<Product[]> = async (
  id,
  dataProvider = PRODUCT_BY_ID_DATA_PROVIDER,
) => {
  if (id === null || id === undefined || typeof id !== 'string' || id === '') {
    throw new Error(ErrorMessages.BadIdValue);
  }

  let productList;
  try {
    productList = await dataProvider.retrieve({
      text: 'select * from products inner join stocks on stocks.product_id = products.id where products.id = $1;',
      values: [id],
    });
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
