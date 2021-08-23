import { handlerPath } from '@libs/handlerResolver';

import { TAWSFunctionEvent } from '../functions-helper';

const events: TAWSFunctionEvent = [
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
    },
  },
];

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events,
};
