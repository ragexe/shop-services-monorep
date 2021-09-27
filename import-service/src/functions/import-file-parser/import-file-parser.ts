import { S3Event, S3EventRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import helper from 'csvtojson';
import * as internal from 'stream';
import { Validator } from 'jsonschema';
import validationSchema from './product-schema';

import { serverlessConfig } from '../../../serverless.config';
import { DefaultLogger } from '../../libs/logger';
import { ErrorMessages } from '../../model';
import { CellParser } from 'csvtojson/v2/Parameters';

export type TImportProcessResult = {
  isSuccessful: boolean;
};

const DEFAULT_PARSER = {
  fromStream: async (readable: internal.Readable) => {
    const result: unknown[] = [];
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

    try {
      await helper({
        colParser: {
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
        },
        checkType: true,
      })
        .fromStream(readable)
        .subscribe(
          (parsedDataRow: { product?: unknown }) => {
            const validator = new Validator();
            const validatorResult = validator.validate(
              parsedDataRow?.product,
              validationSchema,
            );

            if (!validatorResult.valid) {
              DefaultLogger.error(
                `Product data is invalid! ${validatorResult.toString()}`,
              );

              throw new Error(ErrorMessages.ParsedDataIsInvalid);
            }

            result.push(parsedDataRow);
          },
          (error: unknown) => {
            DefaultLogger.error('Parsing csv-file error', error);
          },
          () => {},
        );
    } catch (error) {
      DefaultLogger.error('Parser exception');
      throw error;
    }

    if (result.length === 0) {
      throw new Error(ErrorMessages.SomethingWentWrong);
    }
    return result;
  },
};

export const importFileParser = async (
  event: S3Event,
  parser: {
    fromStream: (readable: internal.Readable) => Promise<unknown[]>;
  } = DEFAULT_PARSER,
  logger = DefaultLogger,
): Promise<TImportProcessResult> => {
  const records: S3EventRecord[] = (event?.Records ?? []).filter(
    (record) => record.eventName === 'ObjectCreated:Put',
  );

  if (records.length < 1) {
    throw new Error(ErrorMessages.EmptyRecordList);
  }

  const s3 = new AWS.S3({ region: serverlessConfig.region });

  const allProcesses: PromiseLike<void>[] = records.map<PromiseLike<void>>(
    async (record) => {
      try {
        const parsedData: unknown[] = await parser.fromStream(
          s3
            .getObject({
              Bucket: `${record.s3.bucket.name}`,
              Key: `${record.s3.object.key}`,
            })
            .createReadStream(),
        );
        logger.debug(`[${record.s3.object.key}] Parsing finished`);
        logger.debug(`Parsed data: ${JSON.stringify(parsedData)}`);

        const copyObjectOutput = await s3
          .copyObject({
            Bucket: record.s3.bucket.name,
            CopySource: `${serverlessConfig.storage.bucketName}/${record.s3.object.key}`,

            Key: record.s3.object.key.replace(
              serverlessConfig.storage.uploadFolderName,
              serverlessConfig.storage.parsedFolderName,
            ),
          })
          .promise();

        logger.debug(copyObjectOutput);
        logger.debug('Copying finished');

        const deleteObjectOutput = await s3
          .deleteObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
          })
          .promise();

        logger.debug(deleteObjectOutput);
        logger.debug('Deleting finished');
      } catch (error) {
        logger.error(error);
        throw new Error(ErrorMessages.SomethingWentWrong);
      }
    },
  );

  try {
    return await Promise.all(allProcesses).then(
      () => ({
        isSuccessful: true,
      }),
      () => ({
        isSuccessful: false,
      }),
    );
  } catch (error) {
    logger.error(error);
    throw new Error(ErrorMessages.SomethingWentWrong);
  }
};
