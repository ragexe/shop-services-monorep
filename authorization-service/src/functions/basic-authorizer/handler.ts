import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  Handler,
} from 'aws-lambda';

import { DefaultLogger } from '../../libs/logger-provider';
import { generatePolicy } from './basic-authorizer';
import { ErrorMessages } from '../../model';

const handler: Handler<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
> = (event, _, callback) => {
  DefaultLogger.trace(event, 'basic-authorizer');

  if (event.type !== 'TOKEN') {
    return callback('Unauthorized');
  }

  try {
    const { authorizationToken, methodArn } = event;
    const encodedCredentials = authorizationToken.split('Basic ')[0];
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const plainCredentialsString = buffer.toString('utf-8');
    const [login, password] = plainCredentialsString.split(':');

    DefaultLogger.log('Credentials were provided ', { login, password });

    const isUserExist: boolean =
      process.env[login] !== null && process.env[login] !== undefined;

    if (!isUserExist) {
      return callback('Unauthorized');
    }

    const isPasswordMatch: boolean =
      isUserExist && process.env[login] === password;

    if (!isPasswordMatch) {
      return callback('Forbidden');
    }

    const apiGatewayAuthorizerResult = generatePolicy({
      principalId: encodedCredentials,
      allow: true,
      methodArn,
    });

    return callback(null, apiGatewayAuthorizerResult);
  } catch (error) {
    DefaultLogger.error(ErrorMessages.SomethingWentWrong, error);
    callback(error);
  }
};

export const main = middyfy(handler);
