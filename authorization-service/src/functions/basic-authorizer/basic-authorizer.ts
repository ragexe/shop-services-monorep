import { APIGatewayAuthorizerResult } from 'aws-lambda';

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
