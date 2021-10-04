import 'source-map-support/register';

import { Validator, ValidatorResult } from 'jsonschema';

import { DataConsumer, ErrorMessages, Product } from '../../model';
import { postProductsConsumer } from '../post-products/post-products';
import { DefaultLogger, ILogger } from './../../libs/logger';
import validationSchema from './../post-products/product-schema';

export type TResult = {
  stored: Product[];
  unstored: { product: Product; error: any }[];
  invalid: {
    product: unknown;
    validatorResult: ValidatorResult;
  }[];
};

export const storeProducts: (
  productsToStore: unknown,
  dataProvider?: DataConsumer<Product>,
  logger?: ILogger,
) => Promise<TResult> = async (
  productsToStore,
  dataConsumer = postProductsConsumer,
  logger = DefaultLogger,
) => {
  if (!productsToStore) {
    throw new Error(ErrorMessages.ProductDataIsInvalid);
  }

  const parsedProducts = [];
  if (Array.isArray(productsToStore)) {
    productsToStore.forEach((product) => {
      parsedProducts.push(product);
    });
  } else {
    parsedProducts.push(productsToStore);
  }

  const validator = new Validator();
  const validatedProducts: {
    product: unknown;
    validatorResult: ValidatorResult;
  }[] = parsedProducts.map((product) => {
    const validatorResult = validator.validate(product, validationSchema);

    return { product, validatorResult };
  });

  const validProducts = validatedProducts
    .filter((validatedProduct) => validatedProduct.validatorResult.valid)
    .map((validatedProduct) => validatedProduct.product as Product);

  const invalidProducts = validatedProducts.filter(
    (validatedProduct) => !validatedProduct.validatorResult.valid,
  );

  const result: TResult = {
    stored: [],
    unstored: [],
    invalid: invalidProducts,
  };

  const productStoreResults = validProducts.map(async (product) => {
    const storeResult: {
      product: Product;
      error?: any;
    } = await dataConsumer
      .store(product)
      .then(() => {
        return { product };
      })
      .catch((error) => {
        logger.error(`Failed to store data`, error);
        return { product, error };
      });

    if (storeResult.error) {
      result.unstored.push({
        product: storeResult.product,
        error: storeResult.error,
      });
    } else {
      result.stored.push(storeResult.product);
    }
  });

  return Promise.all(productStoreResults).then(() => result);
};
