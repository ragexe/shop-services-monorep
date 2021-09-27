import { S3Event } from 'aws-lambda';
import { ProxyEvent } from '../libs/apiGateway';

const isProxyEvent = (event: ProxyEvent | S3Event): event is ProxyEvent => {
  return !!(event as ProxyEvent).queryStringParameters;
};

export const isDebug: (event: ProxyEvent | S3Event) => boolean = (
  event: ProxyEvent | S3Event,
) => {
  if (isProxyEvent(event)) {
    return event.queryStringParameters?.debug === 'true';
  } else {
    return false;
  }
};
