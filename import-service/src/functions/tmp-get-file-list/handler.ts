import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import { formResponse200, formResponse400 } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger-provider';
import { isDebug } from '../functions-helper';
import { getFileList } from './get-file-list';
import { S3 } from 'aws-sdk';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  DefaultLogger.trace(event, 'get-file-list');

  let fileList: S3.Object[];

  try {
    fileList = await getFileList();
  } catch (error) {
    DefaultLogger.error('Lambda handler exception');

    switch (error?.message) {
      default:
        return formResponse400({ error, message: error.message }, event, {
          debug: isDebug(event),
        });
    }
  }

  return formResponse200({ fileList }, event, { debug: isDebug(event) });
};

export const main = middyfy(handler);
