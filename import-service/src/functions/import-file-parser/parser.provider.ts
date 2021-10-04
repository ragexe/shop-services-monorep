import helper from 'csvtojson';
import { CellParser } from 'csvtojson/v2/Parameters';
import { Validator } from 'jsonschema';
import internal from 'stream';

import { DefaultLogger } from '../../libs/logger-provider';
import { ErrorMessages } from '../../model';
import validationSchema from './product-schema';

export type TParserProvider<T = unknown> = {
  fromStream: (readable: internal.Readable, sqs: AWS.SQS) => Promise<T[]>;
};

export const DEFAULT_PARSER: TParserProvider = {
  fromStream: async (readable: internal.Readable, sqsClient) => {
    const result: unknown[] = [];
    const sqsUrl = process.env.SQS_URL;
    if (!sqsUrl) throw new Error(ErrorMessages.SQSUrlWasNotProvided);

    const validator = new Validator();

    return new Promise((resolve, reject) => {
      try {
        helper({
          colParser: productColumnConverter,
          checkType: true,
        })
          .fromStream(readable)
          .subscribe(
            (parsedDataRow: unknown, lineNumber) => {

              const validatorResult = validator.validate(
                parsedDataRow ?? {},
                validationSchema,
              );

              if (!validatorResult.valid) {
                DefaultLogger.error(
                  `ParserProvider:Product data is invalid! #${lineNumber} ${JSON.stringify(
                    validatorResult.errors,
                  )}`,
                );
                reject(ErrorMessages.ParsedDataIsInvalid);
                return;
              }

              result.push(parsedDataRow);
              sqsClient.sendMessage(
                {
                  QueueUrl: sqsUrl,
                  MessageBody: JSON.stringify(parsedDataRow),
                },
                (error, data) => {
                  if (Boolean(error)) {
                    DefaultLogger.error(
                      ErrorMessages.SendMessageFailed,
                      JSON.stringify({ error, data }),
                    );
                    throw new Error(ErrorMessages.SendMessageFailed);
                  } else {
                    DefaultLogger.debug(
                      `Successfully data sent: ${JSON.stringify({
                        QueueUrl: sqsUrl,
                        MessageBody: JSON.stringify(parsedDataRow),
                      })}`,
                    );
                  }
                },
              );
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
  if (item == 'null' || item == '') {
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
  __typename: 'string',
  productCode: 'string',
  name: 'string',
  slug: 'string',
  primaryImage: 'string',
  baseImgUrl: 'string',
  overrideUrl: customNullBooleanStringCellParser,
  'variant.id': 'string',
  'variant.sku': 'string',
  'variant.salePercentage': 'number',
  'variant.attributes.rating': 'number',
  'variant.attributes.maxOrderQuantity': 'number',
  'variant.attributes.availabilityStatus': 'string',
  'variant.attributes.availabilityText': 'string',
  'variant.attributes.vipAvailabilityStatus': customNullBooleanStringCellParser,
  'variant.attributes.vipAvailabilityText': customNullBooleanStringCellParser,
  'variant.attributes.canAddToBag': 'boolean',
  'variant.attributes.canAddToWishlist': 'boolean',
  'variant.attributes.vipCanAddToBag': customNullBooleanStringCellParser,
  'variant.attributes.onSale': 'boolean',
  'variant.attributes.isNew': customNullBooleanStringCellParser,
  'variant.attributes.featuredFlags': 'array',
  'variant.attributes.__typename': 'string',
  'variant.price.formattedAmount': 'string',
  'variant.price.centAmount': 'number',
  'variant.price.currencyCode': 'string',
  'variant.price.formattedValue': 'number',
  'variant.price.__typename': 'string',
  'variant.listPrice.formattedAmount': 'string',
  'variant.listPrice.centAmount': 'number',
  'variant.listPrice.__typename': 'string',
  'variant.__typename': 'string',
};
