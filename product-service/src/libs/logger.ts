import { ProxyEvent } from './apiGateway';

export interface ILogger {
  trace: (event: ProxyEvent, path: string) => void;
  error: (...args: any) => void;
}

export const DefaultLogger: ILogger = {
  trace: (event: ProxyEvent, path: string) => {
    console.log(path.toUpperCase());
    console.log(`Incoming event ${JSON.stringify(event)}`);
  },
  error: (...args: any) => {
    console.error(args);
  },
};
