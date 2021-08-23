import { handlerPath } from '@libs/handlerResolver';

import { TAWSFunctionEvent } from '../functions-helper';

const events: TAWSFunctionEvent = [
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
    },
  },
];

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events,
};
