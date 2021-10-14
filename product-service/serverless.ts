import packageJSON from './package.json';
import { DOCUMENTATION_MODELS } from './serverless-documentation-models';
import { serverlessConfig } from './serverless.config';
import catalogBatchProcess from './src/functions/catalog-batch-process';
import getProductsById from './src/functions/get-products-by-id';
import getProductsList from './src/functions/get-products-list';
import postProducts from './src/functions/post-products';

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
    documentation: {
      api: {
        info: {
          version: packageJSON.version,
          title: 'Product Service API',
          description: packageJSON.description,
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
            description: 'Made for Node in AWS course',
            externalDocs: {
              description: 'Find out more',
              url: 'https://cutt.ly/aWMxksK',
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
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: [
          {
            'Fn::ImportValue': serverlessConfig.parserQueue.importName,
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: [
          {
            Ref: serverlessConfig.notificationQueue.ref,
          },
        ],
      },
    ],
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
      IS_ACTIVE_LOGGER: serverlessConfig.environment.isLoggerActive,
      SNS_ARN: {
        Ref: serverlessConfig.notificationQueue.ref,
      },
    },
    lambdaHashingVersion: serverlessConfig.lambdaHashingVersion,
    region: serverlessConfig.region,
  },
  resources: {
    Resources: {
      [serverlessConfig.notificationQueue.ref]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: serverlessConfig.notificationQueue.topicName,
        },
      },
      SNSSubscriptionProductImportSuccess: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: serverlessConfig.notificationQueue.successEmail,
          Protocol: 'email',
          TopicArn: {
            Ref: serverlessConfig.notificationQueue.ref,
          },
          FilterPolicy: {
            status: [serverlessConfig.notificationQueue.successStatus],
          },
        },
      },
      SNSSubscriptionProductImportFail: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: serverlessConfig.notificationQueue.failEmail,
          Protocol: 'email',
          TopicArn: {
            Ref: serverlessConfig.notificationQueue.ref,
          },
          FilterPolicy: {
            status: [serverlessConfig.notificationQueue.failStatus],
          },
        },
      },
    },
  },
  functions: {
    getProductsList,
    getProductsById,
    postProducts,
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
