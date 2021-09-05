import { DOCUMENTATION_MODELS } from './serverless-documentation-models';
import { serverlessConfig } from './serverless.config';
import getProductsById from './src/functions/get-products-by-id';
import getProductsList from './src/functions/get-products-list';

import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: serverlessConfig.serviceName,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    documentation: {
      api: {
        info: {
          version: '4',
          title: 'Product Service API',
          description: 'This is API based microservice to get mocked products',
          contact: {
            name: 'ragexe',
            url: 'https://discordapp.com/users/ragexe#2978',
            email: 'ragexe@mail.ru',
          },
          license: {
            name: 'The license',
            url: 'https://www.github.com',
          },
        },
        tags: [
          {
            name: serverlessConfig.serviceName,
            description: 'Everything about providing products',
            externalDocs: {
              description: 'Find out more',
              url: 'https://cutt.ly/VWq0pGZ',
            },
          },
        ],
      },
      models: DOCUMENTATION_MODELS,
    },
  },
  plugins: ['serverless-webpack', 'serverless-aws-documentation'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: serverlessConfig.profileName,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED:
        serverlessConfig.environment.awsNodejsConnectionReuseEnabled,
      PG_HOST: serverlessConfig.environment.pgHost,
      PG_PORT: serverlessConfig.environment.pgPort,
      PG_DATABASE: serverlessConfig.environment.pgDatabase,
      PG_USERNAME: serverlessConfig.environment.pgUsername,
      PG_PASSWORD: serverlessConfig.environment.pgPassword,
    },
    lambdaHashingVersion: serverlessConfig.lambdaHashingVersion,
    region: serverlessConfig.region,
  },
  functions: { getProductsList, getProductsById },
};

module.exports = serverlessConfiguration;
