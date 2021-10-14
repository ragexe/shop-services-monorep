import { S3Event, SQSEvent } from 'aws-lambda';

import { ProxyEvent } from './apiGateway';

export interface ILoggerProvider {
  trace: (event: ProxyEvent | S3Event | SQSEvent, path: string) => void;
  error: (...args: any) => void;
  log: (...args: any) => void;
  debug: (...args: any) => void;
}

export const DefaultLogger: ILoggerProvider = {
  trace: (event, path) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) {
      return;
    }

    console.log(path.toUpperCase());
    console.log(`Incoming event ${JSON.stringify(event)}`);
  },
  error: (...args) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) {
      return;
    }

    console.error(args);
  },
  log: (...args) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) {
      return;
    }

    console.log(args);
  },
  debug: (...args) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) {
      return;
    }

    console.log(args);
  },
};
