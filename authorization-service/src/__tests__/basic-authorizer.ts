import { APIGatewayAuthorizerResult } from 'aws-lambda';

import {
  authorizeAPIGateway,
  DEFAULT_POLICY_GENERATOR_PROVIDER,
  IPolicyGeneratorProvider,
} from '../functions/basic-authorizer/basic-authorizer';
import { ErrorMessages } from '../model';

const PERMISSIVE_POLICY: APIGatewayAuthorizerResult = {
  principalId: 'PRINCIPAL_ID',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: 'RESOURCE',
      },
    ],
  },
};

const PROHIBITIVE_POLICY: APIGatewayAuthorizerResult = {
  principalId: 'PRINCIPAL_ID',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: 'RESOURCE',
      },
    ],
  },
};

describe('Helper generatePolicy function', () => {
  test('it should generate a permissive policy', async () => {
    const expected = DEFAULT_POLICY_GENERATOR_PROVIDER.generate({
      allow: true,
      principalId: 'PRINCIPAL_ID',
      methodArn: 'RESOURCE',
    });

    expect(expected).toEqual(PERMISSIVE_POLICY);
  });

  test('it should generate a denial policy', async () => {
    const expected = DEFAULT_POLICY_GENERATOR_PROVIDER.generate({
      allow: false,
      principalId: 'PRINCIPAL_ID',
      methodArn: 'RESOURCE',
    });

    expect(expected).toEqual(PROHIBITIVE_POLICY);
  });
});

describe('Lambda core authorizeAPIGateway function', () => {
  const ORIGINAL_ENVIRONMENT = process.env;

  beforeAll(() => {
    jest.resetModules(); // clears the cache
    process.env = {
      ...ORIGINAL_ENVIRONMENT,
      LOGIN0: 'PASSWORD0', // TE9HSU4wOlBBU1NXT1JEMA==
      LOGIN1: 'PASSWORD1', // TE9HSU4xOlBBU1NXT1JEMQ==
      LOGIN2: 'PASSWORD2', // TE9HSU4yOlBBU1NXT1JEMg==
      LOGIN3: 'PASSWORD3', // TE9HSU4zOlBBU1NXT1JEMw==
      LOGIN4: 'PASSWORD4', // TE9HSU40OlBBU1NXT1JENA==
    };
  });

  test('it should request permissive policy once for every record', async () => {
    const MOCK_POLICY_GENERATOR_PROVIDER: IPolicyGeneratorProvider = {
      generate: () => {
        return {} as APIGatewayAuthorizerResult;
      },
    };

    const spy = jest.spyOn(MOCK_POLICY_GENERATOR_PROVIDER, 'generate');

    const tokens = [
      'Basic TE9HSU4wOlBBU1NXT1JEMA==',
      'Basic TE9HSU4xOlBBU1NXT1JEMQ==',
      'Basic TE9HSU4yOlBBU1NXT1JEMg==',
      'Basic TE9HSU4zOlBBU1NXT1JEMw==',
      'Basic TE9HSU40OlBBU1NXT1JENA==',
    ];

    tokens.forEach((token) => {
      authorizeAPIGateway(
        {
          authorizationToken: token,
          methodArn: 'METHOD_ARN',
        },
        MOCK_POLICY_GENERATOR_PROVIDER,
      );
    });

    expect(spy).toHaveBeenCalledTimes(tokens.length);
    expect(spy).toBeCalledWith({
      allow: true,
      principalId: 'TE9HSU4wOlBBU1NXT1JEMA==',
      methodArn: 'METHOD_ARN',
    });
  });

  test('it should handle falsy token', async () => {
    const MOCK_POLICY_GENERATOR_PROVIDER: IPolicyGeneratorProvider = {
      generate: () => {
        return {} as APIGatewayAuthorizerResult;
      },
    };

    try {
      authorizeAPIGateway(
        {
          authorizationToken: '',
          methodArn: 'METHOD_ARN',
        },
        MOCK_POLICY_GENERATOR_PROVIDER,
      );
    } catch (error) {
      expect(error?.message).toEqual(ErrorMessages.NoAuthTokenProvided);
    }
  });

  test('it should handle wrong type of encoding', async () => {
    const MOCK_POLICY_GENERATOR_PROVIDER: IPolicyGeneratorProvider = {
      generate: () => {
        return {} as APIGatewayAuthorizerResult;
      },
    };

    try {
      authorizeAPIGateway(
        {
          authorizationToken: 'WRONG TE9HSU4xOlBBU1NXT1JEMQ==',
          methodArn: 'METHOD_ARN',
        },
        MOCK_POLICY_GENERATOR_PROVIDER,
      );
    } catch (error) {
      expect(error?.message).toEqual(
        ErrorMessages.WrongAuthorizationTokenEncoding,
      );
    }
  });

  test('it should handle the absence of the user record', async () => {
    const MOCK_POLICY_GENERATOR_PROVIDER: IPolicyGeneratorProvider = {
      generate: () => {
        return {} as APIGatewayAuthorizerResult;
      },
    };

    const spy = jest.spyOn(MOCK_POLICY_GENERATOR_PROVIDER, 'generate');
    const token = 'Basic Tk9VU0VSOlBBU1NXT1JEMA=='; // NOUSER:PASSWORD0

    authorizeAPIGateway(
      {
        authorizationToken: token,
        methodArn: 'METHOD_ARN',
      },
      MOCK_POLICY_GENERATOR_PROVIDER,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith({
      principalId: 'Tk9VU0VSOlBBU1NXT1JEMA==',
      allow: false,
      methodArn: 'METHOD_ARN',
    });
  });

  test('it should handle the case of a password mismatch', async () => {
    const MOCK_POLICY_GENERATOR_PROVIDER: IPolicyGeneratorProvider = {
      generate: () => {
        return {} as APIGatewayAuthorizerResult;
      },
    };

    const spy = jest.spyOn(MOCK_POLICY_GENERATOR_PROVIDER, 'generate');

    const token = 'Basic TE9HSU4zOldST05HX1BBU1NXT1JE'; // LOGIN3:WRONG_PASSWORD

    authorizeAPIGateway(
      {
        authorizationToken: token,
        methodArn: 'METHOD_ARN',
      },
      MOCK_POLICY_GENERATOR_PROVIDER,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith({
      principalId: 'TE9HSU4zOldST05HX1BBU1NXT1JE',
      allow: false,
      methodArn: 'METHOD_ARN',
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENVIRONMENT; // Restore old environment
  });
});
