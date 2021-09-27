import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult, Handler, S3Event } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger';
import { importFileParser, TImportProcessResult } from './import-file-parser';

const handler: Handler<S3Event, APIGatewayProxyResult> = async (event) => {
  DefaultLogger.trace(event, 'import-file-parser');

  let result: TImportProcessResult;

  try {
    result = await importFileParser(event);
  } catch (error) {
    DefaultLogger.error('Lambda handler exception');

    switch (error) {
      default:
        return formatJSONResponse({
          ...error,
          message: error.message ?? 'failed',
        });
    }
  }

  return formatJSONResponse({ message: 'success' });
};

export const main = middyfy(handler);
