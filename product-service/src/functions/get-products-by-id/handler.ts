import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

import { Product } from '../../model';
import { isDebug } from './../functions-helper';
import { getProductsById } from './get-products-by-id';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  const products: Product[] = getProductsById(event.queryStringParameters.id);

  const resultResponseBody = {
    ...(isDebug(event) ? { event } : {}),
    products,
  };

  return formatJSONResponse(resultResponseBody);
};

export const main = middyfy(handler);
