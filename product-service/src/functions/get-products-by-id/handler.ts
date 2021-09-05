import 'source-map-support/register';

import {
  formResponse200,
  formResponse400,
  formResponse404,
} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

import { Product } from '../../model';
import { ErrorMessages } from './../../model';
import { isDebug } from './../functions-helper';
import { getProductsById } from './get-products-by-id';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  let products: Product[];

  try {
    products = await getProductsById(event?.queryStringParameters?.id);
  } catch (error) {
    switch (error.message) {
      case ErrorMessages.NotFound:
        return formResponse404(
          { error: error, message: error.message },
          event,
          {
            debug: isDebug(event),
          },
        );

      case ErrorMessages.SomethingBadHappened:
      case ErrorMessages.BadIdValue:
      case ErrorMessages.BadFormat:
      default:
        return formResponse400(
          { error: error, message: error.message },
          event,
          {
            debug: isDebug(event),
          },
        );
    }
  }

  return formResponse200({ products }, event, { debug: isDebug(event) });
};

export const main = middyfy(handler);
