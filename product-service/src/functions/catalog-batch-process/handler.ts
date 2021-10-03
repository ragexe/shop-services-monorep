import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult, Handler, SQSEvent } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger';

const handler: Handler<SQSEvent, APIGatewayProxyResult> = async (event) => {
  DefaultLogger.trace(event, 'catalog-batch-process');

  // TODO: Get rid of any
  let result: any = { isSuccessful: false };

  try {
    // result = null;
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
