import { S3Event, S3EventRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';

import { serverlessConfig } from '../../../serverless.config';
import { DefaultLogger, ILoggerProvider } from '../../libs/logger-provider';
import { ErrorMessages } from '../../model';
import { DEFAULT_PARSER, TParserProvider } from './parser.provider';

export type TImportProcessResult = {
  isSuccessful: boolean;
};

export const importFileParser = async (
  event: S3Event,
  parser: TParserProvider = DEFAULT_PARSER,
  logger: ILoggerProvider = DefaultLogger,
): Promise<TImportProcessResult> => {
  const sqsUrl = process.env.SQS_URL;
  if (!sqsUrl) throw new Error(ErrorMessages.SQSUrlWasNotProvided);

  const eventRecords: S3EventRecord[] = (event?.Records ?? []).filter(
    (record) => record.eventName === 'ObjectCreated:Put',
  );
  if (eventRecords.length < 1) throw new Error(ErrorMessages.EmptyRecordList);

  const s3 = new AWS.S3({ region: serverlessConfig.region });

  const allProcesses: Promise<void>[] = eventRecords.map<Promise<void>>(
    async (record) => {
      try {
        // Catching NoSuchKey & StreamContentLengthMismatch exceptions before opening stream
        await s3
          .headObject({
            Bucket: `${record.s3.bucket.name}`,
            Key: `${record.s3.object.key}`,
          })
          .promise();

        const readFileStream = s3
          .getObject({
            Bucket: `${record.s3.bucket.name}`,
            Key: `${record.s3.object.key}`,
          })
          .createReadStream();

        const sqsQueue = new AWS.SQS();

        let parsedData: unknown[];
        try {
          parsedData = await parser.fromStream(readFileStream, sqsQueue);
        } catch (error) {
          logger.error('allProcesses', error);
          return Promise.reject(error);
        }

        logger.debug(
          `Parsing of [${record.s3.object.key}] finished`,
          `Parsed entities: ${JSON.stringify(parsedData)}`,
        );

        let copyObjectOutput;
        try {
          copyObjectOutput = await s3
            .copyObject({
              Bucket: record.s3.bucket.name,
              CopySource: `${serverlessConfig.storage.bucketName}/${record.s3.object.key}`,

              Key: record.s3.object.key.replace(
                serverlessConfig.storage.uploadFolderName,
                serverlessConfig.storage.parsedFolderName,
              ),
            })
            .promise();
        } catch (error) {
          logger.error(error);
          return Promise.reject(error);
        }
        logger.debug('Copying finished', copyObjectOutput);

        let deleteObjectOutput;
        try {
          deleteObjectOutput = await s3
            .deleteObject({
              Bucket: record.s3.bucket.name,
              Key: record.s3.object.key,
            })
            .promise();
        } catch (error) {
          logger.error(error);
          return Promise.reject(error);
        }
        logger.debug('Deleting finished', deleteObjectOutput);

        return Promise.resolve();
      } catch (error) {
        logger.error('importFileParser', error);
        return Promise.reject(new Error(ErrorMessages.SomethingWentWrong));
      }
    },
  );

  return await Promise.all(
    allProcesses.map((process) =>
      process.catch((error) => {
        logger.error('process', error);
        return Promise.reject(error);
      }),
    ),
  ).then(
    () => ({
      isSuccessful: true,
    }),
    () => ({
      isSuccessful: false,
    }),
  );
};
