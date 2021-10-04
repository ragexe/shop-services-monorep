import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult, Handler, SQSEvent } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger';
import { storeProducts, TResult } from './helper';

const handler: Handler<SQSEvent, APIGatewayProxyResult> = async (event) => {
  DefaultLogger.trace(event, 'catalog-batch-process');

  let result: TResult;

  try {
    result = await storeProducts(
      event.Records.map((record) => JSON.parse(record.body)),
    );
  } catch (error) {
    switch (error) {
      default:
        return formatJSONResponse(
          {
            ...error,
            message: error.message ?? 'Failed',
          },
          202,
        );
    }
  }

  const isSuccessful =
    result.unstored.length === 0 && result.invalid.length === 0;

  DefaultLogger.log({
    stored: result.stored.length,
    unstored: result.unstored.length,
    invalid: result.invalid.length,
  });

  return formatJSONResponse({ ...result }, isSuccessful ? 200 : 202);
};

export const main = middyfy(handler);
