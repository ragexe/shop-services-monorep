import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

type TSupportedStatusCodes = 200 | 400 | 404;
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
  event: APIGatewayProxyEvent,
  { debug = false }: Partial<TOptions>,
) => formResponse(200, payload, event, { debug });

export const formResponse400 = (
  payload: Record<string, unknown>,
  event: APIGatewayProxyEvent,
  { debug = false }: Partial<TOptions>,
) => {
  return formResponse(400, payload, event, { debug });
};

export const formResponse404 = (
  payload: Record<string, unknown>,
  event: APIGatewayProxyEvent,
  { debug = false }: Partial<TOptions>,
) => {
  return formResponse(404, payload, event, { debug });
};

const formResponse = (
  statusCode: TSupportedStatusCodes,
  payload: Record<string, unknown>,
  event: APIGatewayProxyEvent,
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
