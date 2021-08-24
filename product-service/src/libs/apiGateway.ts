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

export const formResponse200: (
  response: Record<string, unknown>,
  proxyEvent: APIGatewayProxyEvent,
  { debug: boolean },
) => {
  statusCode: 200 | 400;
  body: string;
} = (response: Record<string, unknown>, event, { debug = false }) => {
  const resultResponseBody = {
    ...(debug ? { event } : {}),
    ...response,
  };

  return formatJSONResponse(200, resultResponseBody);
};

export const formResponse400: (
  response: Record<string, unknown>,
  proxyEvent: APIGatewayProxyEvent,
  { debug: boolean },
) => {
  statusCode: 200 | 400;
  body: string;
} = (response: Record<string, unknown>, event, { debug = false }) => {
  const resultResponseBody = {
    ...(debug ? { event } : {}),
    ...response,
  };

  return formatJSONResponse(400, resultResponseBody);
};

const formatJSONResponse = (statusCode: 200 | 400, response) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
