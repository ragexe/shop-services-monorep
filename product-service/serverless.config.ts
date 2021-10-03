import { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

dotenv.config();

export const serverlessConfig: {
  serviceName: string;
  profileName: string;
  region: AWS['provider']['region'];
  lambdaHashingVersion: AWS['provider']['lambdaHashingVersion'];
  parserQueue: {
    importName: string;
    batchSize: number;
  };
  environment: {
    UserBaseUrl: string;
    EtlUrl: string;
    awsNodejsConnectionReuseEnabled: string;
    pgHost: string;
    pgPort: string;
    pgDatabase: string;
    pgUsername: string;
    pgPassword: string;
    isLoggerActive: string;
  };
} = {
  serviceName: 'product-service',
  profileName: 'default',
  region: 'eu-west-1',
  lambdaHashingVersion: '20201221',
  parserQueue: {
    importName: 'ParsedQueueImportServiceArn',
    batchSize: 5,
  },
  environment: {
    UserBaseUrl: process.env.USER_SERVICE_URL ?? '',
    EtlUrl: process.env.ETL_SERVICE_URL ?? '',
    awsNodejsConnectionReuseEnabled:
      process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED ?? '1',
    pgHost: process.env.PG_HOST ?? '',
    pgPort: process.env.PG_PORT ?? '',
    pgDatabase: process.env.PG_DATABASE ?? '',
    pgUsername: process.env.PG_USERNAME ?? '',
    pgPassword: process.env.PG_PASSWORD ?? '',
    isLoggerActive: process.env.IS_ACTIVE_LOGGER ?? 'false',
  },
};
