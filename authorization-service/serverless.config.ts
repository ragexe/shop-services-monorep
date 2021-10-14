import { AWS } from '@serverless/typescript';

export const serverlessConfig: {
  serviceName: string;
  profileName: string;
  region: AWS['provider']['region'];
  lambdaHashingVersion: AWS['provider']['lambdaHashingVersion'];
  authorizerName: string;
} = {
  serviceName: 'authorization-service',
  profileName: 'default',
  region: 'eu-west-1',
  lambdaHashingVersion: '20201221',
  authorizerName: 'tokenAuthorizer',
};

