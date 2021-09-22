import { handlerPath } from '@libs/handlerResolver';
import { serverlessConfig } from '../../../serverless.config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'test',
        request: {
          parameters: {
            querystrings: {
              debug: false,
            },
          },
        },
        cors: true,
        documentation: {
          summary: 'Returns list of uploaded/parsed files',
          description: 'Interacts with S3 AWS service to provide bucket content',
          tags: [serverlessConfig.serviceName],
          queryParams: [
            {
              name: 'debug',
              description: 'If true the API response contains event object',
            }
          ],
          methodResponses: [
            {
              statusCode: '200',
              responseBody: {
                description: 'Successful operation',
              },
              responseModels: {
                'application/json': 'FileListWrapper',
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
