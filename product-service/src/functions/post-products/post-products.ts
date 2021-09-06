import 'source-map-support/register';

import { FromSchema } from 'json-schema-to-ts';
import { Validator } from 'jsonschema';

import { DataConsumer, ErrorMessages, Product } from '../../model';
import { getDataBaseClient } from '../functions-helper';
import { DefaultLogger, ILogger } from './../../libs/logger';
import { getProductDTO } from './../../model';
import validationSchema from './product-schema';
import { postRequestProductSchema } from './schema';

const postProductsConsumer: DataConsumer<Product> = {
  store: async (product) => {
    const productDTO = getProductDTO(product);
    const databaseClient = getDataBaseClient();
    await databaseClient.connect();

    try {
      await databaseClient.query('BEGIN');
      const insertProductsQueryPattern = `INSERT INTO products (
            __typename,
            product_code,
            title,
            description,
            price,
            slug,
            primary_image,
            base_img_url,
            override_url,
            variant
        ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            +$5, 
            $6, 
            $7, 
            $8, 
            $9,
            $10
        ) RETURNING id`;

      const {
        rows: [{ id }, ..._],
      } = await databaseClient.query<{ id: string }>(
        insertProductsQueryPattern,
        [
          productDTO.__typename,
          productDTO.product_code,
          productDTO.title,
          productDTO.description,
          productDTO.price,
          productDTO.slug,
          productDTO.primary_image,
          productDTO.base_img_url,
          productDTO.override_url,
          productDTO.variant,
        ],
      );

      const insertStocksQueryPattern =
        'INSERT INTO stocks (product_id, count) VALUES ($1, $2)';
      const insertPhotoValues = [id, productDTO.count];
      await databaseClient.query(insertStocksQueryPattern, insertPhotoValues);

      await databaseClient.query('COMMIT');
    } catch (error) {
      await databaseClient.query('ROLLBACK');
      DefaultLogger.error(error);
      throw error;
    } finally {
      databaseClient.end();
    }
  },
};

export const postProducts: (
  productToStore:
    | FromSchema<typeof postRequestProductSchema>
    | null
    | undefined,
  dataProvider?: DataConsumer<Product>,
  logger?: ILogger,
) => Promise<void> = async (
  productToStore,
  dataConsumer = postProductsConsumer,
  logger = DefaultLogger,
) => {
  if (!productToStore) {
    throw new Error(ErrorMessages.ProductDataIsInvalid);
  }

  const validator = new Validator();
  const validatorResult = validator.validate(
    productToStore.product,
    validationSchema,
  );

  if (!validatorResult.valid) {
    logger.error(`Product data is invalid! ${validatorResult.toString()}`);
    // TODO: Smooth error handling; Custom Errors
    throw new Error(ErrorMessages.ProductDataIsInvalid);
  }

  try {
    return await dataConsumer.store(productToStore.product as Product);
  } catch (error) {
    logger.error(`Failed to store data!`);
    throw new Error(ErrorMessages.InternalDBError);
  }
};
