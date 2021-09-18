import { serverlessConfig } from './serverless.config';
import importProductsFile from './src/functions/import-products-file';

import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: serverlessConfig.serviceName,
  frameworkVersion: '2',
  useDotenv: true,
  disabledDeprecations: '*',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: serverlessConfig.profileName,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: [`arn:aws:s3:::${serverlessConfig.storage.bucketName}`],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [`arn:aws:s3:::${serverlessConfig.storage.bucketName}/*`],
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED:
        serverlessConfig.environment.awsNodejsConnectionReuseEnabled,
      IS_ACTIVE_LOGGER: serverlessConfig.environment.isLoggerActive,
    },
    lambdaHashingVersion: serverlessConfig.lambdaHashingVersion,
    region: serverlessConfig.region,
  },
  functions: { importProductsFile },
};

module.exports = serverlessConfiguration;
