import { APIGatewayAuthorizerResult } from 'aws-lambda';

import { ILoggerProvider } from '../../libs/logger-provider';
import { ErrorMessages } from '../../model';

export const authorizeAPIGateway: (
  {
    authorizationToken,
    methodArn,
  }: {
    authorizationToken: string;
    methodArn: string;
  },
  logger?: ILoggerProvider,
) => APIGatewayAuthorizerResult = (
  { authorizationToken, methodArn },
) => {
  if (!authorizationToken) {
    throw new Error(ErrorMessages.NoAuthTokenProvided);
  }
  
  if (!authorizationToken.startsWith('Basic ')) {
    throw new Error(ErrorMessages.WrongAuthorizationTokenEncoding);
  }

  const encodedCredentials = authorizationToken.split(' ')[1];

  const buffer = Buffer.from(encodedCredentials, 'base64');
  const plainCredentialsString = buffer.toString('utf-8');
  const [login, password] = plainCredentialsString.split(':');

  const isUserExist: boolean =
    process.env[login] !== null && process.env[login] !== undefined;

  if (!isUserExist) {
    throw new Error(ErrorMessages.UserDoesNotExist);
  }

  const isPasswordMatch: boolean =
    isUserExist && process.env[login] === password;

  if (!isPasswordMatch) {
    throw new Error(ErrorMessages.PasswordDoesNotMatch);
  }

  const apiGatewayAuthorizerResult = generatePolicy({
    principalId: encodedCredentials,
    allow: true,
    methodArn,
  });

  return apiGatewayAuthorizerResult;
};

export const generatePolicy: ({
  allow,
  principalId,
  methodArn,
}: {
  principalId: string;
  allow: boolean;
  methodArn: string;
}) => APIGatewayAuthorizerResult = ({ principalId, allow, methodArn }) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: allow ? 'Allow' : 'Deny',
          Resource: methodArn,
        },
      ],
    },
  };
};
