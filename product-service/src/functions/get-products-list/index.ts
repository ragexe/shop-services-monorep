import { handlerPath } from '@libs/handlerResolver';

import { TAWSFunctionCustomEvent } from '../functions-helper';

const events: TAWSFunctionCustomEvent = [
  {
    http: {
      method: 'get',
      path: 'getProductsList',
      request: {
        parameters: {
          querystrings: {
            debug: false,
          },
        },
      },
      cors: true,
      documentation: {
        summary: 'Returns products',
        description: 'Returns list of all available products',
        tags: ['product-service'],
        queryParams: [
          {
            name: 'debug',
            description: 'If true the API response contains event object',
          },
        ],
        methodResponses: [
          {
            statusCode: '200',
            responseBody: {
              description: 'Successful operation',
            },
            responseModels: {
              'application/json': 'ProductsWrapper',
            },
          },
          {
            statusCode: '400',
            responseModels: {
              'application/json': 'JsonResponse400',
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
