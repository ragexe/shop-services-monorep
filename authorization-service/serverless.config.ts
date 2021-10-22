import { AWS } from '@serverless/typescript';

export const serverlessConfig: {
  serviceName: string;
  profileName: string;
  region: AWS['provider']['region'];
  lambdaHashingVersion: AWS['provider']['lambdaHashingVersion'];
  authorizer: { ref: string; exportName: string };
} = {
  serviceName: 'authorization-service',
  profileName: 'default',
  region: 'eu-west-1',
  lambdaHashingVersion: '20201221',
  authorizer: { ref: 'BasicAuthorizerARN', exportName: 'basicAuthorizer' },
};
