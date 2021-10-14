import { APIGatewayAuthorizerResult } from 'aws-lambda';

import { ErrorMessages } from '../../model';

export const authorizeAPIGateway: (
  {
    authorizationToken,
    methodArn,
  }: {
    authorizationToken: string;
    methodArn: string;
  },
  policyGenerator?: IPolicyGeneratorProvider,
) => APIGatewayAuthorizerResult = (
  { authorizationToken, methodArn },
  policyGenerator = DEFAULT_POLICY_GENERATOR_PROVIDER,
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

  const apiGatewayAuthorizerResult = policyGenerator.generate({
    principalId: encodedCredentials,
    allow: isPasswordMatch,
    methodArn,
  });

  return apiGatewayAuthorizerResult;
};

export interface IPolicyGeneratorProvider {
  generate: ({
    allow,
    principalId,
    methodArn,
  }: {
    principalId: string;
    allow: boolean;
    methodArn: string;
  }) => APIGatewayAuthorizerResult;
}
export const DEFAULT_POLICY_GENERATOR_PROVIDER: IPolicyGeneratorProvider = {
  generate: ({ principalId, allow, methodArn }) => {
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
  },
};
