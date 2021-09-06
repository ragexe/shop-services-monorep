import 'source-map-support/register';

import {
  formResponse200,
  formResponse400,
  formResponse404,
  formResponse500,
} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

import { DefaultLogger } from '../../libs/logger';
import { isDebug } from '../functions-helper';
import { ErrorMessages, Product } from './../../model';
import { getProductsList } from './get-products-list';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  DefaultLogger.trace(event, 'get-products-list');

  let products: Product[];

  try {
    products = await getProductsList();
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

      case ErrorMessages.InternalDBError:
        return formResponse500(
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
