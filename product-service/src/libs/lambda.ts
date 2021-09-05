import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyResult, Handler } from 'aws-lambda';

import { ProxyEvent } from './apiGateway';

export const middyfy = (
  handler: Handler<ProxyEvent, APIGatewayProxyResult> | any,
) => {
  return middy(handler).use(middyJsonBodyParser());
};
