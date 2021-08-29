import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const middyfy = (
  handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>,
) => {
  return middy(handler).use(middyJsonBodyParser());
};

