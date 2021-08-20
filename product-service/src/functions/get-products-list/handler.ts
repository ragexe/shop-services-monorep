import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import products from './products.json';

const getProductsList: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> =
  async (event) => {
    return formatJSONResponse({
      products,
      event,
    });
  };

export const main = middyfy(getProductsList);
