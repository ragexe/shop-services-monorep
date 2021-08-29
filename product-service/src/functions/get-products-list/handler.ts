import 'source-map-support/register';

import { formResponse200, formResponse400 } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

import { isDebug } from '../functions-helper';
import { Product } from './../../model';
import { getProductsList } from './get-products-list';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  let products: Product[];

  try {
    products = getProductsList();
  } catch (error) {
    return formResponse400({ error: error, message: error.message }, event, {
      debug: isDebug(event),
    });
  }

  return formResponse200({ products }, event, { debug: isDebug(event) });
};

export const main = middyfy(handler);
