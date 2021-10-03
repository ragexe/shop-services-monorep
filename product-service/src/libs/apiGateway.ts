import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export type ProxyEvent = Omit<APIGatewayProxyEvent, 'body'> & { body: string | null | object };

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

type TSupportedStatusCodes = 200 | 400 | 500 | 404;
type TOptions = {
  debug: boolean;
};
type TResponse = {
  statusCode: TSupportedStatusCodes;
  headers: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  body: string;
};

export const formResponse200 = (
  payload: Record<string, unknown>,
  event: ProxyEvent,
  { debug = false }: Partial<TOptions>,
) => formResponse(200, payload, event, { debug });

export const formResponse400 = (
  payload: Record<string, unknown>,
  event: ProxyEvent,
  { debug = false }: Partial<TOptions>,
) => {
  return formResponse(400, payload, event, { debug });
};

export const formResponse500 = (
  payload: Record<string, unknown>,
  event: ProxyEvent,
  { debug = false }: Partial<TOptions>,
) => {
  return formResponse(500, payload, event, { debug });
};

export const formResponse404 = (
  payload: Record<string, unknown>,
  event: ProxyEvent,
  { debug = false }: Partial<TOptions>,
) => {
  return formResponse(404, payload, event, { debug });
};

const formResponse = (
  statusCode: TSupportedStatusCodes,
  payload: Record<string, unknown>,
  event: ProxyEvent,
  { debug }: TOptions,
) => {
  const resultResponseBody = {
    ...(debug ? { event } : {}),
    ...payload,
  };

  const result: TResponse = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(resultResponseBody),
  };

  return result;
};

export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode = 200,
) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    statusCode,
    body: JSON.stringify(response),
  };
};
