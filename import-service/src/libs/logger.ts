import { S3Event } from 'aws-lambda';
import { ProxyEvent } from './apiGateway';

export interface ILogger {
  trace: (event: ProxyEvent | S3Event, path: string) => void;
  error: (...args: any) => void;
  log: (...args: any) => void;
  debug: (...args: any) => void;
}

export const DefaultLogger: ILogger = {
  trace: (event: ProxyEvent | S3Event, path: string) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) { return; }

    console.log(path.toUpperCase());
    console.log(`Incoming event ${JSON.stringify(event)}`);
  },
  error: (...args: any) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) { return; }

    console.error(args);
  },
  log: (...args: any) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) { return; }

    console.log(args);
  },
  debug: (...args: any) => {
    const isActive = process.env.IS_ACTIVE_LOGGER === 'true';
    if (!isActive) { return; }

    console.log(args);
  },
};
