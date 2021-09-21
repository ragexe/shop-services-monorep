import { S3Event, S3EventRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import helper from 'csvtojson';
import * as internal from 'stream';

import { serverlessConfig } from '../../../serverless.config';
import { DefaultLogger } from '../../libs/logger';
import { ErrorMessages } from '../../model';

export type TImportProcessResult = {
  isSuccessful: boolean;
};

const DEFAULT_PARSER = {
  fromStream: async (readable: internal.Readable) => {
    const result: unknown[] = [];

    await helper()
      .fromStream(readable)
      .subscribe(
        (parsedDataRow: unknown) => {
          // TODO: Validation in accordance with product schema
          result.push(parsedDataRow);
        },
        (error: unknown) => {
          DefaultLogger.error('Parsing csv-file error', error);
        },
        () => {},
      );

    return result;
  },
};

export const importFileParser = async (
  event: S3Event,
  parser: {
    fromStream: (readable: internal.Readable) => Promise<unknown[]>;
  } = DEFAULT_PARSER,
  logger = DefaultLogger
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
