import { handlerPath } from '@libs/handlerResolver';

import { TAWSFunctionCustomEvent } from '../functions-helper';

const events: TAWSFunctionCustomEvent = [
  {
    http: {
      method: 'post',
      path: 'postProduct',
      request: {
        parameters: {
          querystrings: {
            debug: false,
          },
        },
      },
      cors: true,
      documentation: {
        summary: 'Store provided product to database',
        description: 'Saves the object to the database on the server',
        tags: ['product-service'],
        queryParams: [
          {
            name: 'debug',
            description: 'If true the API response contains event object',
          },
        ],
        requestModels: {
          'application/json': 'StoreProduct',
        },
        methodResponses: [
          {
            statusCode: '200',
            responseBody: {
              description: 'Successful operation',
            },
            responseModels: {
              'application/json': 'ResponseWithMessage',
            },
          },
          {
            statusCode: '400',
            responseModels: {
              'application/json': 'ResponseWithMessage',
            },
          },
          {
            statusCode: '500',
            responseModels: {
              'application/json': 'ResponseWithMessage',
            },
          },
        ],
      },
    },
  },
];

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events,
};
