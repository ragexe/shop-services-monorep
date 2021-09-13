import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

import { DefaultLogger } from '../../libs/logger';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> =
  async (event) => {
    DefaultLogger.trace(event, 'import-products-file');

    return formatJSONResponse({
      message: `Hello world!`,
      event,
    });
  };

export const main = middyfy(handler);
