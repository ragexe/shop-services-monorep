import { handlerPath } from '@libs/handlerResolver';

import { TAWSFunctionCustomEvent } from '../functions-helper';

const events: TAWSFunctionCustomEvent = [
  {
    http: {
      method: 'get',
      path: 'getProductsById',
      request: {
        parameters: {
          querystrings: {
            id: true,
            debug: false,
          },
        },
      },
      documentation: {
        summary: 'Finds products with provided {id} and returns list of them',
        tags: ['product-service'],
        queryParams: [
          {
            name: 'debug',
            description: 'If true the API response contains event object',
          },
          {
            name: 'id',
            description: 'The value of the identifier for the search',
          },
        ],
        methodResponses: [
          {
            statusCode: '200',
            responseBody: {
              description: 'Successful operation',
            },
            responseModels: {
              'application/json': 'Products',
            },
          },
          {
            statusCode: '400',
            responseModels: {
              'application/json': '400JsonResponse',
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
