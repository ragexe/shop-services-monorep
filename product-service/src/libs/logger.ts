import { SQSEvent } from 'aws-lambda';
import { ProxyEvent } from './apiGateway';

export interface ILogger {
  trace: (event: ProxyEvent | SQSEvent, path: string) => void;
  error: (...args: any) => void;
}

export const DefaultLogger: ILogger = {
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
};
