import { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

dotenv.config();

export const serverlessConfig: {
  serviceName: string;
  profileName: string;
  region: AWS['provider']['region'];
  lambdaHashingVersion: AWS['provider']['lambdaHashingVersion'];
  environment: {
    awsNodejsConnectionReuseEnabled: string;
    isLoggerActive: string;
  };
} = {
  serviceName: 'import-service',
  profileName: 'default',
  region: 'eu-west-1',
  lambdaHashingVersion: '20201221',
  environment: {
    awsNodejsConnectionReuseEnabled:
      process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED ?? '1',
    isLoggerActive: process.env.IS_ACTIVE_LOGGER ?? 'false',
  },
};
