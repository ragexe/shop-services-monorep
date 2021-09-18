import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { uuid } from 'uuidv4';
import { serverlessConfig } from '../../../serverless.config';
import { formResponse200, formResponse400 } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger';
import { isDebug } from './functions-helper';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  DefaultLogger.trace(event, 'import-products-file');

  if (!event.queryStringParameters.name) {
    return formResponse400(
      { error: 'error', message: 'error.message' },
      event,
      {
        debug: isDebug(event),
      },
    );
  }

  const getNameExtension = (fileName: string) => {
    const extension = fileName.toLowerCase().match(/.[a-z]{3,4}$/)[0] ?? '';
    const name = fileName.replace(extension, '');

    return { name, extension };
  };

  const { name, extension } = getNameExtension(
    event.queryStringParameters.name,
  );

  const s3 = new S3({ region: serverlessConfig.region });
  const key = `${
    serverlessConfig.storage.uploadFolderName
  }/${name}.${uuid()}${extension}`;
  const params = {
    Bucket: serverlessConfig.storage.bucketName,
    Key: key,
    ContentType: 'text/csv',
    Expires: 60,
  };

  let presignedUrl: string;
  try {
    presignedUrl = await s3.getSignedUrlPromise('putObject', params);
  } catch (error) {
    DefaultLogger.error(error);
    return formResponse400({ error, message: error.message }, event, {
      debug: isDebug(event),
    });
  }

  return formResponse200({ presignedUrl }, event, { debug: isDebug(event) });
};

export const main = middyfy(handler);
