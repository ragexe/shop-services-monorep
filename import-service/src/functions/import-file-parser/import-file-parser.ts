import { S3Event, S3EventRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csvParser from 'csvtojson';

import { serverlessConfig } from '../../../serverless.config';
import { DefaultLogger } from '../../libs/logger';
import { ErrorMessages } from '../../model';

export type TImportProcessResult = {
  success: boolean;
};

export const importFileParser = async (
  event: S3Event,
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
        await csvParser()
          .fromStream(
            s3
              .getObject({
                Bucket: `${record.s3.bucket.name}`,
                Key: `${record.s3.object.key}`,
              })
              .createReadStream(),
          )
          .subscribe(
            (json) => {
              // TODO: Validation in accordance with product schema
              DefaultLogger.log(`Parsed data: ${JSON.stringify(json)}`);
            },
            (error) => {
              DefaultLogger.error('Parsing csv-file error.', error);
            },
            () => {
              DefaultLogger.log(`[${record.s3.object.key}] Parsing finished`);
            },
          );

        DefaultLogger.log('Converting finished');

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

        DefaultLogger.log(copyObjectOutput);
        DefaultLogger.log('Copying finished');

        const deleteObjectOutput = await s3
          .deleteObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
          })
          .promise();

        DefaultLogger.log(deleteObjectOutput);
        DefaultLogger.log('Deleting finished');
      } catch (error) {
        DefaultLogger.error(error);
        throw new Error(ErrorMessages.SomethingWentWrong);
      }
    },
  );

  try {
    return await Promise.all(allProcesses).then(
      () => ({
        success: true,
      }),
      () => ({
        success: false,
      }),
    );
  } catch (error) {
    DefaultLogger.error(error);
    throw new Error(ErrorMessages.SomethingWentWrong);
  }
};
