import { AWS } from '@serverless/typescript';
import { APIGatewayProxyEvent } from 'aws-lambda';

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

export interface MethodResponseClass {
  statusCode: string;
  responseBody?: { description: string };
  responseModels: Models;
}

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

export const isDebug: (event: APIGatewayProxyEvent) => boolean = (
  event: APIGatewayProxyEvent,
) => event.queryStringParameters?.debug === 'true';
