import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

import { formResponse200, formResponse400 } from '../../libs/apiGateway';
import { DefaultLogger } from '../../libs/logger';
import { isDebug } from '../functions-helper';
import { getSignedUrl } from './get-signed-url';
import { ErrorMessages } from '../../model';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
) => {
  DefaultLogger.trace(event, 'import-products-file');

  let presignedUrl: string;

  try {
    presignedUrl = await getSignedUrl(event.queryStringParameters?.name);
  } catch (error) {
    DefaultLogger.error('Lambda handler exception');

    switch (error) {
      case ErrorMessages.InvalidFileName:
      case ErrorMessages.WrongFileExtension:
      default:
        return formResponse400({ error, message: error.message }, event, {
          debug: isDebug(event),
        });
    }
  }

  return formResponse200({ presignedUrl }, event, { debug: isDebug(event) });
};

export const main = middyfy(handler);
