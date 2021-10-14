import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult, Handler, S3Event } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger-provider';
import { importFileParser, TImportProcessResult } from './import-file-parser';

const handler: Handler<S3Event, APIGatewayProxyResult> = async (event) => {
  DefaultLogger.trace(event, 'import-file-parser');

  let result: TImportProcessResult = { isSuccessful: false };

  try {
    result = await importFileParser(event);
  } catch (error) {
    DefaultLogger.error('ImportFileParser', error);

    switch (error) {
      default:
        return formatJSONResponse(
          {
            ...result,
            ...error,
            message: error.message ?? 'failed',
          },
          202,
        );
    }
  }

  return formatJSONResponse({ ...result }, result.isSuccessful ? 200 : 202);
};

export const main = middyfy(handler);
