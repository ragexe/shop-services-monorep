import { handlerPath } from '@libs/handlerResolver';

import { TAWSFunctionCustomEvent } from '../functions-helper';

const events: TAWSFunctionCustomEvent = [];

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events,
};
