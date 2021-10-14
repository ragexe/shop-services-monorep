import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, Handler } from 'aws-lambda';

import { DefaultLogger } from '../../libs/logger-provider';
import { ErrorMessages } from '../../model';
import { authorizeAPIGateway } from './basic-authorizer';

const handler: Handler<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
> = (event, _, callback) => {
  DefaultLogger.trace(event, 'basic-authorizer');
  if (event.type !== 'TOKEN') return callback('Unauthorized');

  let result: APIGatewayAuthorizerResult;

  try {
    const { authorizationToken, methodArn } = event;
    result = authorizeAPIGateway({ authorizationToken, methodArn });
  } catch (error) {
    switch (error?.message) {
      case ErrorMessages.NoAuthTokenProvided:
      case ErrorMessages.UserDoesNotExist:
      case ErrorMessages.WrongAuthorizationTokenEncoding:
        return callback('Unauthorized');
      case ErrorMessages.SomethingWentWrong:
      default:
        DefaultLogger.error(ErrorMessages.SomethingWentWrong, error);
        return callback(error);
    }
  }

  return callback(null, result);
};

export const main = middyfy(handler);
