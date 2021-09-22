import packageJSON from './package.json';
import { serverlessConfig } from './serverless.config';
import importFileParser from './src/functions/import-file-parser';
import importProductsFile from './src/functions/import-products-file';
import temporaryFileCheck from './src/functions/tmp-get-file-list';

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
          title: 'Import Service API',
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
      models: [
        {
          name: 'ResponseWithMessage',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
            },
          },
        },
        {
          name: 'PresignedURLWrapper',
          description: '',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              presignedUrl: {
                type: 'string',
              },
            },
          },
        },
        {
          name: 'FileListWrapper',
          description: '',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              fileList: {
                type: 'object',
              },
            },
          },
        },
      ],
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
  functions: { importProductsFile, importFileParser, temporaryFileCheck },
};

module.exports = serverlessConfiguration;
