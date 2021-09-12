import 'source-map-support/register';

import {
  formResponse200,
  formResponse400,
  formResponse500,
  ProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { ErrorMessages } from '../../model';
import { isDebug } from '../functions-helper';
import { DefaultLogger } from './../../libs/logger';
import { postProducts } from './post-products';
import { postRequestProductSchema } from './schema';
import { Handler, APIGatewayProxyResult } from 'aws-lambda';

const handler: ValidatedEventAPIGatewayProxyEvent<
  typeof postRequestProductSchema
> = async (event) => {
  DefaultLogger.trace(event, 'post-products');

  try {
    await postProducts(event?.body);
  } catch (error) {
    switch (error.message) {
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
      case ErrorMessages.ProductDataIsInvalid:
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

  return formResponse200({ message: 'Success!' }, event, {
    debug: isDebug(event),
  });
};

export const main = middyfy(
  handler as Handler<ProxyEvent, APIGatewayProxyResult>,
);
