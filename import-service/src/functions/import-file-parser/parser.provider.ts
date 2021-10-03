import helper from 'csvtojson';
import { CellParser } from 'csvtojson/v2/Parameters';
import { Validator } from 'jsonschema';
import internal from 'stream';

import { DefaultLogger } from '../../libs/logger-provider';
import { ErrorMessages } from '../../model';
import validationSchema from './product-schema';

export type TParserProvider<T = unknown> = {
  fromStream: (readable: internal.Readable) => Promise<T[]>;
};

export const DEFAULT_PARSER: TParserProvider = {
  fromStream: async (readable: internal.Readable) => {
    const result: unknown[] = [];

    return new Promise((resolve, reject) => {
      try {
        helper({
          colParser: productColumnConverter,
          checkType: true,
        })
          .fromStream(readable)
          .subscribe(
            (parsedDataRow: { product?: unknown }, lineNumber) => {
              const validator = new Validator();
              const validatorResult = validator.validate(
                parsedDataRow?.product ?? {},
                validationSchema,
              );

              if (!validatorResult.valid) {
                DefaultLogger.error(
                  `ParserProvider:Product data is invalid! #${lineNumber} ${JSON.stringify(
                    validatorResult.errors,
                  )}`,
                );
                reject(ErrorMessages.ParsedDataIsInvalid);
              }

              result.push(parsedDataRow.product);
            },
            (error) => {
              DefaultLogger.error('Exception while streaming');
              reject(error);
            },
            () => {
              DefaultLogger.debug('Parsing stream completed');
              resolve(result);
            },
          );
      } catch (error) {
        DefaultLogger.error('ParserProvider:', error);
        return Promise.reject(error);
      }
    });
  },
};

const customNullBooleanStringCellParser: CellParser = (item: string) => {
  if (item == 'null') {
    return null;
  }
  if (item == 'false') {
    return false;
  }
  if (item == 'true') {
    return true;
  }
  return item;
};

const productColumnConverter = {
  'product.__typename': 'string',
  'product.productCode': 'string',
  'product.name': 'string',
  'product.slug': 'string',
  'product.primaryImage': 'string',
  'product.baseImgUrl': 'string',
  'product.overrideUrl': customNullBooleanStringCellParser,
  'product.variant.id': 'string',
  'product.variant.sku': 'string',
  'product.variant.salePercentage': 'number',
  'product.variant.attributes.rating': 'number',
  'product.variant.attributes.maxOrderQuantity': 'number',
  'product.variant.attributes.availabilityStatus': 'string',
  'product.variant.attributes.availabilityText': 'string',
  'product.variant.attributes.vipAvailabilityStatus':
    customNullBooleanStringCellParser,
  'product.variant.attributes.vipAvailabilityText':
    customNullBooleanStringCellParser,
  'product.variant.attributes.canAddToBag': 'boolean',
  'product.variant.attributes.canAddToWishlist': 'boolean',
  'product.variant.attributes.vipCanAddToBag':
    customNullBooleanStringCellParser,
  'product.variant.attributes.onSale': 'boolean',
  'product.variant.attributes.isNew': customNullBooleanStringCellParser,
  'product.variant.attributes.featuredFlags': 'array',
  'product.variant.attributes.__typename': 'string',
  'product.variant.price.formattedAmount': 'string',
  'product.variant.price.centAmount': 'number',
  'product.variant.price.currencyCode': 'string',
  'product.variant.price.formattedValue': 'number',
  'product.variant.price.__typename': 'string',
  'product.variant.listPrice.formattedAmount': 'string',
  'product.variant.listPrice.centAmount': 'number',
  'product.variant.listPrice.__typename': 'string',
  'product.variant.__typename': 'string',
};
