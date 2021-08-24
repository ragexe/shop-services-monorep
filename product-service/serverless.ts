import getProductsById from './src/functions/get-products-by-id';
import getProductsList from './src/functions/get-products-list';

import { DOCUMENTATION_MODELS } from './serverless-documentation-models';

import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    documentation: {
      api: {
        info: {
          version: '2',
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
            name: 'product-service',
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
    profile: 'default',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
  },
  functions: { getProductsList, getProductsById },
};

module.exports = serverlessConfiguration;
