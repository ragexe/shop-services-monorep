import { serverlessConfig } from './serverless.config';
import basicAuthorizer from './src/functions/basic-authorizer';

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
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: serverlessConfig.profileName,
    region: serverlessConfig.region,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { basicAuthorizer },
};

module.exports = serverlessConfiguration;
