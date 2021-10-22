import { S3Event } from 'aws-lambda';
import { AWS } from '@serverless/typescript';
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

export interface Models {
  'application/json':
    | string
    | {
        schema: {
          type: string;
          items: string;
        };
      };
}

export interface MethodResponseClass {
  statusCode: string;
  responseBody?: { description: string };
  responseModels: Models;
}

export interface Documentation {
  summary: string;
  tags: string[];
  description?: string;
  requestModels?: Models;
  queryParams?: {
    name: string;
    description: string;
    required?: boolean;
  }[];
  methodResponses?: Array<MethodResponseClass | string>;
}

type TAWSFunctionEvent = NonNullable<
  NonNullable<AWS['functions']>[string]['events']
>[number];

type TAWSFunctionHTTPEventWithDocumentation =
  | Extract<
      TAWSFunctionEvent,
      {
        http: any;
      }
    > & {
      http: {
        documentation?: Documentation;
      };
    };

export type TAWSFunctionCustomEvent = (
  | TAWSFunctionEvent
  | TAWSFunctionHTTPEventWithDocumentation
)[];

export type TEvents = NonNullable<AWS['functions']>[string]['events'];
export type TLambdaDescription = {
  handler: string;
  events: TAWSFunctionCustomEvent;
  documentation?: any;
};
