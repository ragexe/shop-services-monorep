import { ProxyEvent } from '../../libs/apiGateway';

export const isDebug: (event: ProxyEvent) => boolean = (event: ProxyEvent) =>
  event.queryStringParameters?.debug === 'true';
