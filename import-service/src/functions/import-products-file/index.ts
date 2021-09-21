import { handlerPath } from '@libs/handlerResolver';
import { serverlessConfig } from '../../../serverless.config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true,
              debug: false,
            },
          },
        },
        cors: true,
        documentation: {
          summary: 'Returns presigned URL to upload .csv files',
          description: 'Interacts with S3 AWS service to provide upload-link',
          tags: [serverlessConfig.serviceName],
          queryParams: [
            {
              name: 'debug',
              description: 'If true the API response contains event object',
            },
            {
              name: 'name',
              description: 'Name of file to upload',
            },
          ],
          methodResponses: [
            {
              statusCode: '200',
              responseBody: {
                description: 'Successful operation',
              },
              responseModels: {
                'application/json': 'PresignedURLWrapper',
              },
            },
            {
              statusCode: '400',
              responseModels: {
                'application/json': 'ResponseWithMessage',
              },
            },
          ],
        },
      },
    },
  ],
};
