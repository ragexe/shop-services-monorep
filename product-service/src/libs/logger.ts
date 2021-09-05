import { ProxyEvent } from './apiGateway';

export const Logger = {
  trace: (event: ProxyEvent, path: string) => {
    console.log(path.toUpperCase());
    console.log(`Incoming event ${JSON.stringify(event)}`);
  },
  error: (...args: any) => {
    console.error(args);
  },
};
