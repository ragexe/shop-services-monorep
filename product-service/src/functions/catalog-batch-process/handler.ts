import 'source-map-support/register';

import * as AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult, Handler, SQSEvent } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger';
import { notifySubscribers, storeProducts, TResult } from './catalog-batch-process';
import { serverlessConfig } from '../../../serverless.config';
import { ErrorMessages } from '../../model';

const handler: Handler<SQSEvent, APIGatewayProxyResult> = async (event) => {
  DefaultLogger.trace(event, 'catalog-batch-process');
  const snsClient = new AWS.SNS({ region: serverlessConfig.region });
  const snsArn = process.env.SNS_ARN;

  let result: TResult;

  try {
    if (!snsArn) throw new Error(ErrorMessages.NoSNSTopicProvided);

    result = await storeProducts(
      event.Records.map((record) => JSON.parse(record.body)),
    );
  } catch (error) {
    switch (error?.message) {
      default:
        notifySubscribers(snsClient, snsArn, {
          isSuccessful: false,
          message: JSON.stringify({ error, event }, null, '\t'),
        });

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

  notifySubscribers(snsClient, snsArn, {
    isSuccessful,
    message: JSON.stringify({ event, result }, null, '\t'),
  });

  return formatJSONResponse({ ...result }, isSuccessful ? 200 : 202);
};

export const main = middyfy(handler);
